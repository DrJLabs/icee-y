import { describe, expect, it, vi } from 'vitest';

// Mock the environment variables before importing Env
const mockEnv = vi.hoisted(() => ({
  NODE_ENV: 'test',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb',
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
  CLERK_WEBHOOK_SECRET: 'whsec_test_123',
  NEXT_PUBLIC_ARCJET_KEY: 'aj_test_123',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_test_123',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com',
  SENTRY_DSN: 'https://test@test.ingest.sentry.io/123',
}));

vi.stubGlobal('process', {
  env: mockEnv,
});

describe('Env', () => {
  describe('Environment validation', () => {
    it('should successfully parse valid environment variables', async () => {
      // Dynamic import to ensure mocked env is used
      const { Env } = await import('./Env');

      expect(Env.NODE_ENV).toBe('test');
      expect(Env.DATABASE_URL).toBe('postgresql://test:test@localhost:5432/testdb');
      expect(Env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).toBe('pk_test_123');
      expect(Env.CLERK_SECRET_KEY).toBe('sk_test_123');
      expect(Env.CLERK_WEBHOOK_SECRET).toBe('whsec_test_123');
      expect(Env.NEXT_PUBLIC_ARCJET_KEY).toBe('aj_test_123');
      expect(Env.NEXT_PUBLIC_POSTHOG_KEY).toBe('phc_test_123');
      expect(Env.NEXT_PUBLIC_POSTHOG_HOST).toBe('https://us.i.posthog.com');
      expect(Env.SENTRY_DSN).toBe('https://test@test.ingest.sentry.io/123');
    });

    it('should expose correct client-side environment variables', async () => {
      const { Env } = await import('./Env');

      // Verify NEXT_PUBLIC_ prefixed variables are available
      expect(Env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY).toBeDefined();
      expect(Env.NEXT_PUBLIC_ARCJET_KEY).toBeDefined();
      expect(Env.NEXT_PUBLIC_POSTHOG_KEY).toBeDefined();
      expect(Env.NEXT_PUBLIC_POSTHOG_HOST).toBeDefined();
    });

    it('should expose server-only environment variables', async () => {
      const { Env } = await import('./Env');

      // Verify server-only variables are available
      expect(Env.DATABASE_URL).toBeDefined();
      expect(Env.CLERK_SECRET_KEY).toBeDefined();
      expect(Env.CLERK_WEBHOOK_SECRET).toBeDefined();
      expect(Env.SENTRY_DSN).toBeDefined();
    });

    it('should handle NODE_ENV correctly', async () => {
      const { Env } = await import('./Env');

      expect(['development', 'test', 'production']).toContain(Env.NODE_ENV);
    });
  });

  describe('Type safety', () => {
    it('should provide proper TypeScript types', async () => {
      const { Env } = await import('./Env');

      // These should compile without TypeScript errors
      const nodeEnv: 'development' | 'test' | 'production' = Env.NODE_ENV;
      const dbUrl: string = Env.DATABASE_URL;
      const clerkKey: string = Env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

      expect(typeof nodeEnv).toBe('string');
      expect(typeof dbUrl).toBe('string');
      expect(typeof clerkKey).toBe('string');
    });
  });
});
