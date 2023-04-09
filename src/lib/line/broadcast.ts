import { getUnnotifiedEarliestReportContent } from '../../repositories/reportContentRepository';
import { completeNotification } from '../../repositories/reportRepository';
import { getAlertMessage } from '../../service/message/alertMessageService';
import { lineClient } from './lineClient';

export const broadcastMessage = async (): Promise<boolean> => {
  const report = await getUnnotifiedEarliestReportContent();

  if (!report) {
    return false;
  }

  await completeNotification(report.reportId);

  const message = await getAlertMessage(report);
  await lineClient.broadcast(message);

  return true;
};
