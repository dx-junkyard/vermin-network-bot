export const ReportMessage = {
  START: 'start',
  ANIMAL: 'animal',
  GEO: 'geo',
  DAMAGE: 'damage',
  UNDEFINED: 'undefined',
  RETRY: 'retry',
  FINISH: 'finish',
} as const;

export type ReportMessageType =
  (typeof ReportMessage)[keyof typeof ReportMessage];
