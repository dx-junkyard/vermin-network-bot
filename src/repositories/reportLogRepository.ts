import { PrismaClient, ReportLog } from '@prisma/client';

import { ContentJson } from '../types/content';
const prisma = new PrismaClient();

export const createReportLog = async (
  reportId: number,
  reportType: string,
  content: ContentJson,
  nextScheduledType: string
): Promise<ReportLog> => {
  return await prisma.reportLog.create({
    data: {
      reportId,
      reportType,
      content,
      nextScheduledType,
    },
  });
};

export const getLatestLog = async (
  reportId: number
): Promise<ReportLog | undefined> => {
  return (
    (await prisma.reportLog.findFirst({
      where: {
        reportId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })) || undefined
  );
};
