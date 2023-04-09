import { Request, Response } from 'express';

import { getReportContentList } from '../repositories/reportContentRepository';
import { convertUTCtoJST, toDate } from '../utils/dateUtils';

export const reportList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { from, to } = req.query;

  const reportContentList = await getReportContentList(
    from ? toDate(from as string) : undefined,
    to ? toDate(to as string) : undefined
  );

  const reportContentListReponse = reportContentList.map((report) => {
    return {
      userId: report.report.user.id,
      animal: report.animal,
      latitude: report.latitude,
      longitude: report.longitude,
      // APIレスポンスのため、nullを許容する
      damage: report.damage,
      address: report.locationName || null,
      createdAt: convertUTCtoJST(report.createdAt),
    };
  });

  return res.status(200).json({
    reports: reportContentListReponse,
  });
};
