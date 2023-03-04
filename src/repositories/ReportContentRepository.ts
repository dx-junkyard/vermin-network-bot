import { PrismaClient, Report, ReportLog } from '@prisma/client';

import { findReportLog } from './ReportLogRepository';

const prisma = new PrismaClient();

export const createContentReport = async (
  reportId: number
): Promise<Report> => {
  const reportLog = await findReportLog(reportId);

  const animal = JSON.parse(getElementByType('animal', reportLog))?.animal;
  const damage = JSON.parse(getElementByType('damage', reportLog))?.imageId;
  const geo = JSON.parse(getElementByType('geo', reportLog));
  const latitude = Math.round((geo?.latitude || 0) * 1000000) / 1000000;
  const longitude = Math.round((geo?.longitude || 0) * 1000000) / 1000000;
  const address = geo?.address || '';
  const point = `POINT(${latitude} ${longitude})`;

  return await prisma.$queryRaw`INSERT INTO ReportContent (reportId, animal, damage, geo, latitude, longitude, address, updatedAt) VALUES (${reportId}, ${animal}, ${damage}, ST_GEOMFROMTEXT(${point}, 4326), ${latitude}, ${longitude}, ${address}, CURRENT_TIMESTAMP)`;
};

function getElementByType(type: string, array: ReportLog[]): string {
  return array.find((element) => element.type === type)?.content || '{}';
}

export type ReportResult = {
  createdAt: Date;
  animal: string;
  damage: string | null;
  latitude: number;
  longitude: number;
  address: string;
  report: {
    user: {
      id: number;
    };
  };
};

export const getReportContentList = async (
  from: Date | undefined,
  to: Date | undefined
): Promise<ReportResult[]> => {
  return await prisma.reportContent.findMany({
    where: {
      // 期間で絞り込み
      createdAt: {
        gte: from,
        lte: to,
      },
    },
    // 更新日時が最新のレポートを取得
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      createdAt: true,
      animal: true,
      damage: true,
      latitude: true,
      longitude: true,
      address: true,
      report: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};
