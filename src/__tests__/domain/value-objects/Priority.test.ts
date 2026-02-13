import { describe, it, expect } from '@jest/globals';
import { Priority } from '../../../domain/value-objects/Priority';

describe('Priority - Value Object', () => {
  describe('fromString()', () => {
    it('should create Priority with "Standard"', () => {
      const priority = Priority.fromString('Standard');
      expect(priority.toString()).toBe('Standard');
    });

    it('should create Priority with "Priority"', () => {
      const priority = Priority.fromString('Priority');
      expect(priority.toString()).toBe('Priority');
    });

    it('should create Priority with "Expedite"', () => {
      const priority = Priority.fromString('Expedite');
      expect(priority.toString()).toBe('Expedite');
    });

    it('should throw error with invalid priority', () => {
      expect(() => Priority.fromString('VeryHigh')).toThrow(
        'Priority không hợp lệ: VeryHigh'
      );
    });

    it('should handle leading/trailing spaces', () => {
      const priority = Priority.fromString('  Standard  ');
      expect(priority.toString()).toBe('Standard');
    });
  });

  describe('toString()', () => {
    it('should return priority value as string', () => {
      expect(Priority.STANDARD.toString()).toBe('Standard');
      expect(Priority.PRIORITY.toString()).toBe('Priority');
      expect(Priority.EXPEDITE.toString()).toBe('Expedite');
    });
  });

  describe('Static constants', () => {
    it('should have STANDARD constant', () => {
      expect(Priority.STANDARD).toBeDefined();
      expect(Priority.STANDARD.toString()).toBe('Standard');
    });

    it('should have PRIORITY constant', () => {
      expect(Priority.PRIORITY).toBeDefined();
      expect(Priority.PRIORITY.toString()).toBe('Priority');
    });

    it('should have EXPEDITE constant', () => {
      expect(Priority.EXPEDITE).toBeDefined();
      expect(Priority.EXPEDITE.toString()).toBe('Expedite');
    });
  });
});
