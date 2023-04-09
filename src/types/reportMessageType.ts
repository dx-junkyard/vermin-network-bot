export const ReportMessage = {
  START: 'start',
  ANIMAL: 'animal',
  GEO: 'geo',
  DAMAGE: 'damage',
  UNDEFINED: 'undefined',
  RETRY: 'retry',
  FINISH: 'finish',
  USAGE: 'usage',
} as const;

export type ReportMessageType =
  (typeof ReportMessage)[keyof typeof ReportMessage];

export const convertReportMessageType = (type: string) => {
  return (
    ReportMessage[type as keyof typeof ReportMessage] || ReportMessage.UNDEFINED
  );
};
