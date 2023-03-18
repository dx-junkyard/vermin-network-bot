import { ReportLog } from '@prisma/client';

export const EMPTY_CONTENT = '{}';

export function getElementByType(type: string, array: ReportLog[]): string {
  return (
    array.sort().find((element) => element.reportType === type)?.content || '{}'
  );
}
