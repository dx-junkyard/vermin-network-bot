import { PrismaClient, ReportLog } from '@prisma/client';
const prisma = new PrismaClient();

export const createReportLog = async (
  reportId: number,
  type: string,
  content: string
): Promise<ReportLog> => {
  return await prisma.reportLog.create({
    data: {
      reportId,
      type,
      content,
    },
  });
};

export const findReportLog = async (reportId: number): Promise<ReportLog[]> => {
  return await prisma.reportLog.findMany({
    where: {
      reportId,
    },
  });
};
