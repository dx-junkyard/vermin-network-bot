import { PrismaClient } from '@prisma/client';

import { getElementByType } from '../types/Content';

const prisma = new PrismaClient();

/**
 * 獣害報告の完了処理を行う
 *
 * @param id 獣害報告ID
 * @returns 獣害報告内容ID
 */
export const completeReport = async (id: number): Promise<number> => {
  // 獣害報告を初期化する
  return await prisma.$transaction(async (tx) => {
    // 獣害報告ログを取得する
    const reportLogs = await tx.reportLog.findMany({
      where: {
        reportId: id,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    // 獣害報告ログから獣害報告内容を作成し、獣害報告内容テーブルに保存する
    const animal = JSON.parse(getElementByType('animal', reportLogs))?.animal;
    const damage = JSON.parse(getElementByType('damage', reportLogs))?.imageUrl;
    const geo = JSON.parse(getElementByType('geo', reportLogs));
    const latitude = Math.round((geo?.latitude || 0) * 1000000) / 1000000;
    const longitude = Math.round((geo?.longitude || 0) * 1000000) / 1000000;
    const address = geo?.address || '';
    const point = `POINT(${latitude} ${longitude})`;

    const num =
      await tx.$executeRaw`INSERT INTO ReportContent (reportId, animal, damage, geo, latitude, longitude, address, updatedAt) VALUES (${id}, ${animal}, ${damage}, ST_GEOMFROMTEXT(${point}, 4326), ${latitude}, ${longitude}, ${address}, CURRENT_TIMESTAMP)`;

    // 獣害報告を完了にする
    await tx.report.update({
      where: {
        id,
      },
      data: {
        isCompleted: true,
      },
    });

    return num;
  });
};
