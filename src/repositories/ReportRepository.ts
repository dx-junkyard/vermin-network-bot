import { PrismaClient, Report } from '@prisma/client';

const prisma = new PrismaClient();

export const completeNotification = async (
  reportId: number
): Promise<Report> => {
  return await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      isNotified: true,
    },
  });
};

export const getExpiredReport = async (to: Date): Promise<Report[]> => {
  return await prisma.report.findMany({
    where: {
      isCompleted: false,
      isDeleted: false,
      createdAt: {
        lt: to,
      },
    },
  });
};

export const isAllCompleteReport = async () => {
  const reports = await prisma.report.findMany({
    where: {
      isCompleted: false,
    },
  });

  return reports.length === 0;
};

export const getProcessingReport = async (
  userId: string
): Promise<Report | null> => {
  return await prisma.report.findFirst({
    // ユーザIDと未完了フラグで絞り込み
    where: {
      userId,
      isCompleted: false,
    },
    // 更新日時が最新のレポートを取得
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

/**
 * レポートを初期化する
 *
 * @param userId LINEユーザID
 * @returns {Promise<Report>}
 */
export const initReport = async (userId: string): Promise<Report> => {
  return await prisma.report.create({
    data: {
      userId: userId,
      isCompleted: false,
    },
  });
};

export const deleteReport = async (id: number): Promise<Report> => {
  return await prisma.report.update({
    where: {
      id,
    },
    data: {
      isCompleted: true,
      isDeleted: true,
    },
  });
};

export const completeReport = async (id: number): Promise<Report> => {
  return await prisma.report.update({
    where: {
      id,
    },
    data: {
      isCompleted: true,
    },
  });
};
