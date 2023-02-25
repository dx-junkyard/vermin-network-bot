import { PrismaClient, Report, ReportLog } from '@prisma/client';

import { findReportLog } from './ReportLogRepository';

const prisma = new PrismaClient();

export const convertReport = async (reportId: number): Promise<Report> => {
  const reportLog = await findReportLog(reportId);

  const animal = JSON.parse(getElementByType('animal', reportLog)).animal;
  const damage = JSON.parse(getElementByType('damage', reportLog)).imageId;
  const geo = JSON.parse(getElementByType('location', reportLog));

  const geomFromText = `ST_GeomFromText('POINT(${geo.latitude} ${geo.longitude})', 4326)`;

  return await prisma.$queryRaw`INSERT INTO ReportContent (reportId, animal, content, geo) VALUES (${reportId}, ${animal}, ${damage}, ${geomFromText})`;
};

function getElementByType(type: string, array: ReportLog[]): string {
  return array.find((element) => element.type === type)?.content || '{}';
}
