import { TemplateMessage, TextMessage } from '@line/bot-sdk';

import {
  deleteReport,
  getProcessingReport,
} from '../repositories/ReportRepository';

export async function getReplyFinishMessage(
  userId: string
): Promise<(TextMessage | TemplateMessage)[]> {
  const report = await getProcessingReport(userId);

  if (report) {
    await deleteReport(report.id);
  }

  return [
    {
      type: 'text',
      text: '報告作業を完了しました。',
    },
  ];
}
