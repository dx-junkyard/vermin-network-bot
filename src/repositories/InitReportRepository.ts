import { PrismaClient } from '@prisma/client';

import { EMPTY_CONTENT } from '../types/Content';
import { ReportMessage, ReportMessageType } from '../types/ReportMessageType';

const prisma = new PrismaClient();

export type InitResult = {
  reportId: number;
  reportLogId: number;
};

/**
 * 獣害報告の初期化を行う
 *
 * @param userId ユーザID
 * @returns 獣害報告ID
 */
export const initReport = async (
  userId: string,
  nextScheduledType: ReportMessageType
): Promise<InitResult> => {
  // 獣害報告を初期化する
  return await prisma.$transaction(async (tx) => {
    const initialReport = await tx.report.create({
      data: {
        userId: userId,
        isCompleted: false,
        isDeleted: false,
        isNotified: false,
      },
    });

    const log = await tx.reportLog.create({
      data: {
        reportId: initialReport.id,
        type: ReportMessage.START,
        content: EMPTY_CONTENT,
        nextScheduledType,
      },
    });

    return {
      reportId: initialReport.id,
      reportLogId: log.id,
    };
  });
};
