import { Request, Response } from 'express';

import { broadcastMessage } from '../lib/line/broadcast';
import { pushExpireMessage } from '../lib/line/pushMessage';
import {
  deleteReport,
  getExpiredReport,
  isAllCompleteReport,
} from '../repositories/reportRepository';

const EXPIRE_MINUTES = 30;

export const cronNotice = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const isAllComplete = await isAllCompleteReport();

  if (!isAllComplete) {
    return res.status(200).json({
      status: 'success',
      isAllComplete,
      notice: false,
    });
  }
  const notice = await broadcastMessage();
  return res.status(200).json({
    status: 'success',
    isAllComplete,
    notice,
  });
};

export const cronReportExpire = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const now = new Date();
  const thresholdTime = new Date(now.getTime() - EXPIRE_MINUTES * 60 * 1000);
  const reports = await getExpiredReport(thresholdTime);

  const nonBlockingReports = reports.map(async (report) => {
    const { userId, id } = report;

    // 通報を論理削除
    await deleteReport(id);

    // 通報期限切れメッセージを送信
    return await pushExpireMessage(userId);
  });

  await Promise.all(nonBlockingReports);

  return res.status(200).json({
    status: 'success',
    num: reports.length,
  });
};
