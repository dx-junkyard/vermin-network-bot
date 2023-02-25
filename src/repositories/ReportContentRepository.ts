import { PrismaClient, Report, ReportLog } from '@prisma/client';

import { findReportLog } from './ReportLogRepository';

const prisma = new PrismaClient();

export const convertReport = async (reportId: number): Promise<Report> => {
  const reportLog = await findReportLog(reportId);

  const animal = JSON.parse(getElementByType('animal', reportLog))?.animal;
  const damage = JSON.parse(getElementByType('damage', reportLog))?.imageId;
  const geo = JSON.parse(getElementByType('geo', reportLog));
  const latitude = geo?.latitude;
  const longitude = geo?.longitude;

  const geomFromText = `ST_GeomFromText('POINT(${latitude} ${longitude}'), 4326)`;
  console.info(geomFromText);

  return await prisma.$queryRaw`INSERT INTO ReportContent (reportId, animal, damage, geo, latitude, longitude) VALUES (${reportId}, ${animal}, ${damage}, ${geomFromText}, ${latitude}, ${longitude})`;
};

function getElementByType(type: string, array: ReportLog[]): string {
  return array.find((element) => element.type === type)?.content || '{}';
}
