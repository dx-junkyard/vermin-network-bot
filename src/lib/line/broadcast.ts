import { Client, ClientConfig } from '@line/bot-sdk';
import dotenv from 'dotenv';

import { getUnnotifiedReportContent } from '../../repositories/ReportContentRepository';
import { completeNotification } from '../../repositories/ReportRepository';
import { getAlertMessage } from '../../service/AlertMessageService';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

// Create a new LINE SDK client.
export const lineClient = new Client(clientConfig);

export const broadcastMessage = async (): Promise<number> => {
  const reports = await getUnnotifiedReportContent();

  if (reports.length === 0) {
    return 0;
  }

  await completeNotification(reports.map((report) => report.reportId));

  const message = await getAlertMessage(reports);
  await lineClient.broadcast(message);

  return reports.length;
};
