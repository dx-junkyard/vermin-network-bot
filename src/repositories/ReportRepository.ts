import { PrismaClient, Report } from '@prisma/client';

const prisma = new PrismaClient();

export const completeNotification = async (
  reportIds: number[]
): Promise<void> => {
  await prisma.report.updateMany({
    where: {
      id: {
        in: reportIds,
      },
    },
    data: {
      isNotified: true,
    },
  });
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

export const deleteReport = async (reportId: number): Promise<Report> => {
  return await prisma.report.delete({
    where: {
      id: reportId,
    },
  });
};
