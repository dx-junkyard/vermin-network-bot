// Import all dependencies, mostly using destructuring for better view.
import express, { Application } from 'express';

import { cronNotice, cronReportExpire } from './controller/CronController';
import { reportList } from './controller/ReportController';
import { webhook } from './controller/WebhookController';
import { middlewareClient } from './lib/line/lineClient';
import { logger } from './lib/log4js/logger';

const PORT = process.env.PORT || 3000;

// Create a new Express application.
const app: Application = express();

const basePath = '/api';

// cron routes
app.get(`${basePath}/cron/notice`, cronNotice);
app.get(`${basePath}/cron/report/expire`, cronReportExpire);

// report routes
app.get(`${basePath}/report/list`, reportList);

// This route is used for the Webhook.
app.post(`${basePath}/webhook`, middlewareClient, webhook);

if (process.env.NODE_ENV == 'development') {
  // Create a server and listen to it.
  app.listen(PORT, () => {
    logger.info(`Application is live and listening on port ${PORT}`);
  });
}

module.exports = app;
