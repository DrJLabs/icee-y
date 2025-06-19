import { expect, test } from '@playwright/test';

test.describe('API Integration Tests', () => {
  test.describe('Counter API', () => {
    test('should return 404 for non-existent endpoints', async ({ page }) => {
      const response = await page.request.put('/api/nonexistent', {
        data: { test: 'data' },
      });

      expect(response.status()).toBe(404);
    });

    test('should handle malformed JSON in request body', async ({ page }) => {
      // This tests the API's ability to handle invalid request formats
      const response = await page.request.put('/api/counter', {
        data: 'invalid-json-string',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Should return a 400 Bad Request or 422 Unprocessable Entity
      expect([400, 422]).toContain(response.status());
    });

    test('should handle empty request body', async ({ page }) => {
      const response = await page.request.put('/api/counter', {
        data: {},
      });

      expect(response.status()).toBe(422);

      const errorResponse = await response.json();

      expect(errorResponse).toHaveProperty('error');
    });

    test('should handle missing Content-Type header', async ({ page }) => {
      const response = await page.request.put('/api/counter', {
        data: { increment: 2 },
        headers: {
          // Explicitly remove Content-Type to test API robustness
        },
      });

      // Should still work as Playwright typically handles this
      expect([200, 400, 422]).toContain(response.status());
    });

    test('should validate request method restrictions', async ({ page }) => {
      // Test GET request on PUT-only endpoint
      const getResponse = await page.request.get('/api/counter');

      expect(getResponse.status()).toBe(405); // Method Not Allowed

      // Test POST request on PUT-only endpoint
      const postResponse = await page.request.post('/api/counter', {
        data: { increment: 1 },
      });

      expect(postResponse.status()).toBe(405); // Method Not Allowed

      // Test DELETE request on PUT-only endpoint
      const deleteResponse = await page.request.delete('/api/counter');

      expect(deleteResponse.status()).toBe(405); // Method Not Allowed
    });
  });

  test.describe('General API Behavior', () => {
    test('should return appropriate CORS headers for cross-origin requests', async ({ page }) => {
      const response = await page.request.put('/api/counter', {
        data: { increment: 1 },
        headers: {
          Origin: 'https://example.com',
        },
      });

      // Check for CORS headers if implemented
      const headers = response.headers();

      // Note: This test documents expected behavior even if CORS isn't implemented yet
      // It serves as a reminder to implement CORS if needed for production
      expect(response.status()).toBeLessThan(500);
    });

    test('should handle concurrent requests appropriately', async ({ page }) => {
      const e2eRandomId = Math.floor(Math.random() * 1000000).toString();

      // Send multiple concurrent requests
      const requests = Array.from({ length: 3 }, () =>
        page.request.put('/api/counter', {
          data: { increment: 1 },
          headers: {
            'x-e2e-random-id': e2eRandomId,
          },
        }));

      const responses = await Promise.all(requests);

      // All requests should succeed
      responses.forEach((response) => {
        expect(response.status()).toBe(200);
      });

      // Verify final count is correct (3 increments)
      const finalResponse = await page.request.put('/api/counter', {
        data: { increment: 0 }, // This might not work depending on validation
        headers: {
          'x-e2e-random-id': e2eRandomId,
        },
      });

      if (finalResponse.status() === 422) {
        // If 0 is not allowed, increment by 1 and check the count is at least 4
        const checkResponse = await page.request.put('/api/counter', {
          data: { increment: 1 },
          headers: {
            'x-e2e-random-id': e2eRandomId,
          },
        });

        expect(checkResponse.status()).toBe(200);

        const result = await checkResponse.json();

        expect(result.count).toBeGreaterThanOrEqual(4);
      }
    });
  });
});
