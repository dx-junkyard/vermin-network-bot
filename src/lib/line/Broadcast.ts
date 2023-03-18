import { getUnnotifiedEarliestReportContent } from '../../repositories/ReportContentRepository';
import { completeNotification } from '../../repositories/ReportRepository';
import { getAlertMessage } from '../../service/message/AlertMessageService';
import { lineClient } from './LineClient';

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
