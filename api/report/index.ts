// Import all dependencies, mostly using destructuring for better view.
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';

import { getReportContentList } from '../../src/repositories/ReportContentRepository';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

const PORT = process.env.PORT || 3000;

// Create a new Express application.
const app: Application = express();

const basePath = '/api/report';

app.get(
  `${basePath}/list`,
  async (req: Request, res: Response): Promise<Response> => {
    const { from, to } = req.query;

    const reportContentList = await getReportContentList(
      from ? toDate(from as string) : undefined,
      to ? toDate(to as string) : undefined
    );

    return res.status(200).json({
      reports: reportContentList,
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

if (process.env.NODE_ENV == 'development') {
  // Create a server and listen to it.
  app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
  });
}

module.exports = app;
