import {
  Client,
  ClientConfig,
  EventMessage,
  LocationEventMessage,
  Message,
  MessageAPIResponseBase,
  TextEventMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import dotenv from 'dotenv';

import { completeReport } from '../../repositories/CompleteReportRepository';
import { uploadImage } from '../../repositories/ImageUploadRepository';
import { initReport } from '../../repositories/InitReportRepository';
import {
  createReportLog,
  getLatestLog,
} from '../../repositories/ReportLogRepository';
import {
  deleteReport,
  getProcessingReport,
} from '../../repositories/ReportRepository';
import { createUser } from '../../repositories/UserRepository';
import { classifyReportMessageType } from '../../service/ClassifyReportMessageTypeService';
import {
  getAnimalOptionMessage,
  getReployAnimalMessage,
} from '../../service/message/AnimalMessageService';
import { getCompleteMessage } from '../../service/message/CompleteMessageService';
import { getDamageMessage } from '../../service/message/DamageMessageService';
import { getReplyFinishMessage } from '../../service/message/FinishMessageService';
import { getFollowMessage } from '../../service/message/FollowMessageService';
import {
  getGeoMessage,
  getReplyGeoMessage,
} from '../../service/message/GeoMessageService';
import { getReplyRetryMessage } from '../../service/message/RetryMessageService';
import { getReplyStartMessage } from '../../service/message/StartMessageService';
import { getReplyUnknownMessage } from '../../service/message/UnknownMessageService';
import { getAnimalOption } from '../../types/AnimalOption';
import { ContentJson } from '../../types/Content';
import { ReportMessage } from '../../types/ReportMessageType';
import { logger } from '../log4js/logger';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

// Create a new LINE SDK client.
export const lineClient = new Client(clientConfig);

// Function handler to receive the text.
export const botEventHandler = async (
  event: WebhookEvent
): Promise<MessageAPIResponseBase | undefined> => {
  const isMessageEvent = event.type === 'message';
  const isFollowEvent = event.type === 'follow';

  // メッセージイベントでない場合は、何もしない
  if (!isMessageEvent && !isFollowEvent) {
    return;
  }

  // フォローイベントの場合は、専用メッセージで返信する
  if (isFollowEvent) {
    const { replyToken } = event;
    const { userId } = event.source;
    if (userId) {
      await createUser(userId);
    }
    const startMessage = await getFollowMessage();
    return await lineClient.replyMessage(replyToken, startMessage);
  }

  // 受付可能なメッセージ種別を取得する
  const isAcceptableMessageType =
    event.message.type === 'text' ||
    event.message.type === 'image' ||
    event.message.type === 'location';

  // 受付可能なメッセージ種別でない場合は、専用メッセージで返信する
  if (!isAcceptableMessageType) {
    const { replyToken } = event;
    const unknownMessage = await getReplyUnknownMessage();
    return await lineClient.replyMessage(replyToken, unknownMessage);
  }

  // ユーザーIDを取得する
  const userId = event.source.userId;

  // ユーザーIDが取得できない場合は、専用メッセージで返信する
  if (!userId) {
    const { replyToken } = event;
    const unknownMessage = await getReplyUnknownMessage();
    return await lineClient.replyMessage(replyToken, unknownMessage);
  }

  // 処理中のレポートを取得する
  const report = await getProcessingReport(userId);
  const log = report ? await getLatestLog(report.id) : undefined;

  // メッセージ種別を判定する
  const reportMessageType = classifyReportMessageType(
    report,
    log,
    event.message as EventMessage
  );

  let response: Message | Message[];

  try {
    if (reportMessageType === ReportMessage.START) {
      // 投稿済みの獣害報告が存在する場合は、削除する
      if (report !== undefined) {
        const deletedReport = await deleteReport(report.id);
        logger.info(
          `投稿済みの獣害報告が存在するため、削除しました。報告ID:${deletedReport.id}`
        );
      }

      // 獣害報告を初期化し、次回の入力項目を獣害報告入力メッセージとする
      const initResult = await initReport(userId, ReportMessage.ANIMAL);
      logger.info(
        `獣害報告を初期化しました。獣害報告ID:${initResult.reportId}, 獣害報告ログID:${initResult.reportLogId}`
      );

      // メッセージを結合する
      response = [getReplyStartMessage(), getAnimalOptionMessage()];
    } else if (reportMessageType === ReportMessage.ANIMAL && report) {
      const log = await createReportLog(
        report.id,
        ReportMessage.ANIMAL,
        getAnimalOption((event.message as TextEventMessage).text).content,
        ReportMessage.GEO
      );
      logger.info(
        `獣害報告ログを作成しました。獣害報告ログID:${log.id}, 獣害報告ID:${log.reportId}`
      );

      response = [
        getReployAnimalMessage((event.message as TextEventMessage).text),
        getGeoMessage(),
      ];
    } else if (reportMessageType === ReportMessage.GEO && report) {
      const { latitude, longitude, address } =
        event.message as LocationEventMessage;

      const log = await createReportLog(
        report.id,
        ReportMessage.GEO,
        {
          latitude: latitude,
          longitude: longitude,
          address: address,
        } as ContentJson,
        ReportMessage.DAMAGE
      );
      logger.info(
        `獣害報告ログを作成しました。獣害報告ログID:${log.id}, 獣害報告ID:${log.reportId}`
      );

      response = [await getReplyGeoMessage(), getDamageMessage()];
    } else if (reportMessageType === ReportMessage.DAMAGE && report) {
      const imageId =
        event.message.type === 'image' ? event.message.id : undefined;

      let imageUrl = undefined;
      if (imageId) {
        const image = await lineClient.getMessageContent(imageId);
        imageUrl = await uploadImage(imageId, image);
      }

      const content = imageId
        ? ({ imageId: imageId, imageUrl: imageUrl || undefined } as ContentJson)
        : ({
            imageId: undefined,
            imageUrl: imageUrl || undefined,
          } as ContentJson);

      // 処理に失敗しても、ロールバックできないため、トランザクションを張らない
      const log = await createReportLog(
        report.id,
        ReportMessage.DAMAGE,
        content,
        ReportMessage.FINISH
      );
      logger.info(
        `獣害報告ログを作成しました。獣害報告ログID:${log.id}, 獣害報告ID:${log.reportId}`
      );

      await completeReport(report.id);
      logger.info(`獣害報告を完了しました。獣害報告ID:${report.id}`);

      response = getCompleteMessage();
    } else if (reportMessageType === ReportMessage.FINISH) {
      const report = await getProcessingReport(userId);

      if (report) {
        await deleteReport(report.id);
        logger.info(`獣害報告を削除しました。獣害報告ID:${report.id}`);
      }
      response = await getReplyFinishMessage();
    } else if (reportMessageType === ReportMessage.RETRY) {
      response = await getReplyRetryMessage();
    } else if (reportMessageType === ReportMessage.USAGE) {
      response = await getFollowMessage();
    } else {
      response = await getReplyUnknownMessage();
    }
  } catch (e) {
    logger.error(e);
    response = await getReplyRetryMessage();
  }

  const { replyToken } = event;

  return await lineClient.replyMessage(replyToken, response);
};
