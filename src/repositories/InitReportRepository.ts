import { PrismaClient } from '@prisma/client';

import { EMPTY_CONTENT } from '../types/Content';
import { ReportMessage } from '../types/ReportMessageType';

const prisma = new PrismaClient();

export const initReport = async (userId: string): Promise<void> => {
  // 獣害報告を初期化する
  await prisma.$transaction(async (tx) => {
    const initialReport = await tx.report.create({
      data: {
        userId: userId,
        isCompleted: false,
        isDeleted: false,
        isNotified: false,
      },
    });

    await tx.reportLog.create({
      data: {
        reportId: initialReport.id,
        type: ReportMessage.START,
        content: EMPTY_CONTENT,
        nextScheduledType: ReportMessage.ANIMAL,
      },
    });
  });

  return;
};
