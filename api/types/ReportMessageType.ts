export const ReportMessage = {
  START: 'start',
  ANIMAL: 'animal',
  GEO: 'geo',
  DAMAGE: 'damage',
  UNDEFINED: 'undefined',
} as const;

export type ReportMessageType =
  (typeof ReportMessage)[keyof typeof ReportMessage];
