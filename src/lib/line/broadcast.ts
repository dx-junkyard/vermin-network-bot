import { Client, ClientConfig } from '@line/bot-sdk';
import dotenv from 'dotenv';

import { getUnnotifiedEarliestReportContent } from '../../repositories/ReportContentRepository';
import {
  completeNotification,
  isAllCompleteReport,
} from '../../repositories/ReportRepository';
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
