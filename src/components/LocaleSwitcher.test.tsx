import { page } from '@vitest/browser/context';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import messages from '@/locales/en.json';
import { LocaleSwitcher } from './LocaleSwitcher';

// Mock the next-intl navigation
vi.mock('@/libs/I18nNavigation', () => ({
  usePathname: vi.fn(() => '/test-path'),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
  })),
}));

describe('LocaleSwitcher', () => {
  describe('Rendering', () => {
    it('should render the language switcher select element', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      expect(select).toBeVisible();
      expect(select).toHaveAttribute('aria-label', 'lang-switcher');
    });

    it('should have proper select attributes and styling', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      // Verify it's a select element
      expect(select.element().tagName).toBe('SELECT');

      // Check for expected CSS classes
      expect(select).toHaveClass('border');
      expect(select).toHaveClass('border-gray-300');
      expect(select).toHaveClass('rounded');
    });

    it('should display all available language options', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');
      const options = select.getByRole('option');

      // Should have options for both supported languages
      expect(options.elements()).toHaveLength(2);

      // Verify option values and text
      const englishOption = page.getByRole('option', { name: /English/ });
      const frenchOption = page.getByRole('option', { name: /Français/ });

      expect(englishOption).toBeVisible();
      expect(frenchOption).toBeVisible();

      expect(englishOption).toHaveValue('en');
      expect(frenchOption).toHaveValue('fr');
    });

    it('should show current locale as selected', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      expect(select).toHaveValue('en');
    });
  });

  describe('Language Selection', () => {
    it('should allow selecting French language', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      await select.selectOption('fr');

      expect(select).toHaveValue('fr');
    });

    it('should allow selecting English language', async () => {
      // Start with French locale
      render(
        <NextIntlClientProvider locale="fr" messages={{}}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      await select.selectOption('en');

      expect(select).toHaveValue('en');
    });

    it('should handle change events properly', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      // Change to French
      await select.selectOption('fr');

      // Verify the selection changed
      expect(select).toHaveValue('fr');

      // Change back to English
      await select.selectOption('en');

      expect(select).toHaveValue('en');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      // Should have aria-label for screen readers
      expect(select).toHaveAttribute('aria-label', 'lang-switcher');

      // Should be focusable
      expect(select).toBeFocusable();
    });

    it('should be keyboard accessible', async () => {
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      const select = page.getByLabelText('lang-switcher');

      // Focus the select
      await select.focus();

      expect(select).toBeFocused();

      // Should be able to navigate with keyboard
      // Note: Actual keyboard navigation testing might require more sophisticated setup
      expect(select).toBeFocusable();
    });
  });

  describe('Integration with routing', () => {
    it('should work with different initial locales', () => {
      // Test with English
      const { unmount } = render(
        <NextIntlClientProvider locale="en" messages={messages}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      expect(page.getByLabelText('lang-switcher')).toHaveValue('en');

      unmount();

      // Test with French
      render(
        <NextIntlClientProvider locale="fr" messages={{}}>
          <LocaleSwitcher />
        </NextIntlClientProvider>,
      );

      expect(page.getByLabelText('lang-switcher')).toHaveValue('fr');
    });
  });
});
