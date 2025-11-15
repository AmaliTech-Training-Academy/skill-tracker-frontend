import { CompletedPeriod } from '@app/core/models/tasks-model';
import { completedPeriodToString, stringToCompletedPeriod } from './completed-period.util';

describe('CompletedPeriodUtil', () => {
  describe('completedPeriodToString', () => {
    it('should convert TODAY to "Today"', () => {
      expect(completedPeriodToString(CompletedPeriod.TODAY)).toBe('Today');
    });

    it('should convert YESTERDAY to "Yesterday"', () => {
      expect(completedPeriodToString(CompletedPeriod.YESTERDAY)).toBe('Yesterday');
    });

    it('should convert LAST_7_DAYS to "Last 7 days"', () => {
      expect(completedPeriodToString(CompletedPeriod.LAST_7_DAYS)).toBe('Last 7 days');
    });

    it('should convert LAST_30_DAYS to "Last 30 days"', () => {
      expect(completedPeriodToString(CompletedPeriod.LAST_30_DAYS)).toBe('Last 30 days');
    });

    it('should convert OLDER to "Older"', () => {
      expect(completedPeriodToString(CompletedPeriod.OLDER)).toBe('Older');
    });

    it('should convert ALL_PERIODS to "All Periods"', () => {
      expect(completedPeriodToString(CompletedPeriod.ALL_PERIODS)).toBe('All Periods');
    });
  });

  describe('stringToCompletedPeriod', () => {
    it('should convert "Today" to TODAY', () => {
      expect(stringToCompletedPeriod('Today')).toBe(CompletedPeriod.TODAY);
    });

    it('should convert "Yesterday" to YESTERDAY', () => {
      expect(stringToCompletedPeriod('Yesterday')).toBe(CompletedPeriod.YESTERDAY);
    });

    it('should convert "Last 7 days" to LAST_7_DAYS', () => {
      expect(stringToCompletedPeriod('Last 7 days')).toBe(CompletedPeriod.LAST_7_DAYS);
    });

    it('should convert "Last 30 days" to LAST_30_DAYS', () => {
      expect(stringToCompletedPeriod('Last 30 days')).toBe(CompletedPeriod.LAST_30_DAYS);
    });

    it('should convert "Older" to OLDER', () => {
      expect(stringToCompletedPeriod('Older')).toBe(CompletedPeriod.OLDER);
    });

    it('should convert unknown strings to ALL_PERIODS', () => {
      expect(stringToCompletedPeriod('Unknown')).toBe(CompletedPeriod.ALL_PERIODS);
      expect(stringToCompletedPeriod('')).toBe(CompletedPeriod.ALL_PERIODS);
    });
  });
});
