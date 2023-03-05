// Import all dependencies, mostly using destructuring for better view.
import { middleware, MiddlewareConfig, WebhookEvent } from '@line/bot-sdk';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';

import { botEventHandler } from './lib/line/botEventHandler';
import { broadcastMessage } from './lib/line/broadcast';
import { pushExpireMessage } from './lib/line/pushMessage';
import { getReportContentList } from './repositories/ReportContentRepository';
import {
  deleteReport,
  getExpiredReport,
  isAllCompleteReport,
} from './repositories/ReportRepository';
import { convertUTCtoJST } from './utils/DateUtils';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

// middleware
const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

// Create a new Express application.
const app: Application = express();

const basePath = '/api';

app.get(
  `${basePath}/cron/notice`,
  async (req: Request, res: Response): Promise<Response> => {
    const isAllComplete = await isAllCompleteReport();

    if (!isAllComplete) {
      return res.status(200).json({
        status: 'success',
        isAllComplete,
        notice: false,
      });
    }
    const notice = await broadcastMessage();
    return res.status(200).json({
      status: 'success',
      isAllComplete,
      notice,
    });
  }
);

const EXPIRE_MINUTES = 30;

app.get(
  `${basePath}/cron/report/limit`,
  async (req: Request, res: Response): Promise<Response> => {
    const now = new Date();
    const thresholdTime = new Date(now.getTime() - EXPIRE_MINUTES * 60 * 1000);
    const reports = await getExpiredReport(thresholdTime);

    reports.map(async (report) => {
      const { userId, id } = report;

      // 通報を論理削除
      await deleteReport(id);

      // 通報期限切れメッセージを送信
      return await pushExpireMessage(userId);
    });

    return res.status(200).json({
      status: 'success',
      num: reports.length,
    });
  }
);

app.get(
  `${basePath}/report/list`,
  async (req: Request, res: Response): Promise<Response> => {
    const { from, to } = req.query;

    const reportContentList = await getReportContentList(
      from ? toDate(from as string) : undefined,
      to ? toDate(to as string) : undefined
    );

    const reportContentListReponse = reportContentList.map((report) => {
      return {
        userId: report.report.user.id,
        animal: report.animal,
        latitude: report.latitude,
        longitude: report.longitude,
        damage: report.damage,
        address: report.address || null,
        createdAt: convertUTCtoJST(report.createdAt),
      };
    });

    return res.status(200).json({
      reports: reportContentListReponse,
    });
  }
);

const toDate = (dateString: string): Date => {
  return new Date(
    `${dateString.substring(0, 4)}-${dateString.substring(
      4,
      6
    )}-${dateString.substring(6, 8)}`
  );
};

// This route is used for the Webhook.
app.post(
  `${basePath}/webhook`,
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const events: WebhookEvent[] = req.body.events;

    // Process all of the received events asynchronously.
    const results = await Promise.all(
      events.map(async (event: WebhookEvent) => {
        try {
          await botEventHandler(event);
        } catch (err: unknown) {
          if (err instanceof Error) {
            console.error(err);
          }

          // Return an error message.
          return res.status(500).json({
            status: 'error',
          });
        }
      })
    );

    // Return a successfull message.
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

if (process.env.NODE_ENV == 'development') {
  // Create a server and listen to it.
  app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
  });
}

module.exports = app;
