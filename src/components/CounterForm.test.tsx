import { page } from '@vitest/browser/context';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-react';
import messages from '@/locales/en.json';
import { CounterForm } from './CounterForm';

describe('CounterForm', () => {
  describe('Rendering', () => {
    it('should render form elements correctly', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      expect(page.getByLabelText('Increment by')).toBeVisible();
      expect(page.getByRole('button', { name: 'Increment' })).toBeVisible();
    });

    it('should have correct input attributes', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      const input = page.getByLabelText('Increment by');

      expect(input).toHaveAttribute('type', 'number');
      expect(input).toHaveAttribute('name', 'increment');
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '3');
      expect(input).toHaveAttribute('step', '1');
    });

    it('should have proper accessibility attributes', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      const input = page.getByLabelText('Increment by');
      const button = page.getByRole('button', { name: 'Increment' });

      expect(input).toBeVisible();
      expect(button).toBeVisible();

      // Verify the form has proper structure
      expect(page.getByRole('form')).toBeVisible();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid input', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      const input = page.getByLabelText('Increment by');
      const button = page.getByRole('button', { name: 'Increment' });

      await input.fill('2');

      expect(input).toHaveValue('2');

      // Form should be ready to submit
      expect(button).toBeEnabled();

      // Note: We can't easily test actual submission without mocking the server action
      // The form behavior itself is tested here
    });

    it('should allow values within valid range', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      const input = page.getByLabelText('Increment by');

      // Test minimum valid value
      await input.fill('1');

      expect(input).toHaveValue('1');

      // Test maximum valid value
      await input.fill('3');

      expect(input).toHaveValue('3');

      // Test middle value
      await input.fill('2');

      expect(input).toHaveValue('2');
    });
  });

  describe('Input Validation', () => {
    it('should handle invalid inputs gracefully', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      const input = page.getByLabelText('Increment by');

      // Test invalid text input
      await input.fill('abc');

      // Browser should prevent non-numeric input or clear it
      expect(input.element().value).toBe('');

      // Test negative numbers
      await input.fill('-1');
      // Browser validation should handle this based on min attribute
    });

    it('should respect HTML5 validation attributes', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      const input = page.getByLabelText('Increment by');

      // Verify HTML5 validation attributes are properly set
      expect(input).toHaveAttribute('min', '1');
      expect(input).toHaveAttribute('max', '3');
      expect(input).toHaveAttribute('step', '1');
      expect(input).toBeRequired();
    });
  });

  describe('Internationalization', () => {
    it('should display labels in English', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      expect(page.getByLabelText('Increment by')).toBeVisible();
      expect(page.getByRole('button', { name: 'Increment' })).toBeVisible();
    });

    it('should display labels in French', () => {
      const frenchMessages = {
        Counter: {
          increment_counter: 'Incrémenter le compteur de',
          increment_counter_button: 'Incrémenter',
        },
      };

      render(
        <NextIntlClientProvider locale="fr" messages={frenchMessages}>
          <CounterForm />
        </NextIntlClientProvider>,
      );

      expect(page.getByLabelText('Incrémenter le compteur de')).toBeVisible();
      expect(page.getByRole('button', { name: 'Incrémenter' })).toBeVisible();
    });
  });
});
