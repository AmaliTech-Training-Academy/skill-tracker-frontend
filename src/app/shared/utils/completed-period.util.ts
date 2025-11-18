import { CompletedPeriod } from '@app/core/models/tasks-model';

export function completedPeriodToString(period: CompletedPeriod): string {
  switch (period) {
    case CompletedPeriod.TODAY:
      return 'Today';
    case CompletedPeriod.YESTERDAY:
      return 'Yesterday';
    case CompletedPeriod.LAST_7_DAYS:
      return 'Last 7 days';
    case CompletedPeriod.LAST_30_DAYS:
      return 'Last 30 days';
    case CompletedPeriod.OLDER:
      return 'Older';
    case CompletedPeriod.ALL_PERIODS:
      return 'All Periods';
    default:
      return 'All Periods';
  }
}

export function stringToCompletedPeriod(timeRange: string): CompletedPeriod {
  switch (timeRange) {
    case 'Today':
      return CompletedPeriod.TODAY;
    case 'Yesterday':
      return CompletedPeriod.YESTERDAY;
    case 'Last 7 days':
      return CompletedPeriod.LAST_7_DAYS;
    case 'Last 30 days':
      return CompletedPeriod.LAST_30_DAYS;
    case 'Older':
      return CompletedPeriod.OLDER;
    default:
      return CompletedPeriod.ALL_PERIODS;
  }
}
