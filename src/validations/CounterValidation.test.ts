import { describe, expect, it } from 'vitest';
import { CounterValidation } from './CounterValidation';

describe('CounterValidation', () => {
  describe('Valid inputs', () => {
    it('should accept minimum valid value of 1', () => {
      const result = CounterValidation.safeParse({ increment: 1 });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.increment).toBe(1);
      }
    });

    it('should accept maximum valid value of 3', () => {
      const result = CounterValidation.safeParse({ increment: 3 });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.increment).toBe(3);
      }
    });

    it('should accept middle value of 2', () => {
      const result = CounterValidation.safeParse({ increment: 2 });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.increment).toBe(2);
      }
    });

    it('should coerce string numbers to numbers', () => {
      const result = CounterValidation.safeParse({ increment: '2' });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.increment).toBe(2);
        expect(typeof result.data.increment).toBe('number');
      }
    });
  });

  describe('Invalid inputs', () => {
    it('should reject values less than 1', () => {
      const result = CounterValidation.safeParse({ increment: 0 });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('too_small');
      }
    });

    it('should reject negative values', () => {
      const result = CounterValidation.safeParse({ increment: -1 });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('too_small');
      }
    });

    it('should reject values greater than 3', () => {
      const result = CounterValidation.safeParse({ increment: 4 });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('too_big');
      }
    });

    it('should reject non-numeric strings', () => {
      const result = CounterValidation.safeParse({ increment: 'invalid' });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('invalid_type');
      }
    });

    it('should reject null values', () => {
      const result = CounterValidation.safeParse({ increment: null });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('invalid_type');
      }
    });

    it('should reject undefined values', () => {
      const result = CounterValidation.safeParse({ increment: undefined });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('invalid_type');
      }
    });

    it('should reject missing increment field', () => {
      const result = CounterValidation.safeParse({});

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.code).toBe('invalid_type');
      }
    });
  });
});
