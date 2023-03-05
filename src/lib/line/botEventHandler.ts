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

import { uploadImage } from '../../repositories/ImageUploadRepository';
import { createContentReport } from '../../repositories/ReportContentRepository';
import {
  createReportLog,
  findReportLog,
  getLatestLog,
} from '../../repositories/ReportLogRepository';
import {
  completeReport,
  deleteReport,
  getProcessingReport,
  initReport,
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
import { ReportMessage } from '../../types/ReportMessageType';

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
  let log;
  if (report && (await findReportLog(report.id)).length >= 1) {
    log = await getLatestLog(report.id);
  } else {
    log = null;
  }

  // メッセージ種別を判定する
  const reportMessageType = classifyReportMessageType(
    report,
    log,
    event.message as EventMessage
  );

  let response: Message | Message[];

  if (reportMessageType === ReportMessage.START) {
    if (report) {
      await deleteReport(report.id);
    }

    // 報告を初期化する
    const initialReport = await initReport(userId);
    await createReportLog(
      initialReport.id,
      ReportMessage.START,
      '{}',
      ReportMessage.ANIMAL
    );
    // メッセージを結合する
    response = [getReplyStartMessage(), getAnimalOptionMessage()];
  } else if (reportMessageType === ReportMessage.ANIMAL && report) {
    await createReportLog(
      report.id,
      ReportMessage.ANIMAL,
      getAnimalOption((event.message as TextEventMessage).text).content,
      ReportMessage.GEO
    );

    response = [
      await getReployAnimalMessage((event.message as TextEventMessage).text),
      getGeoMessage(),
    ];
  } else if (reportMessageType === ReportMessage.GEO && report) {
    const { latitude, longitude, address } =
      event.message as LocationEventMessage;

    await createReportLog(
      report.id,
      ReportMessage.GEO,
      `{"latitude":${latitude},"longitude":${longitude},"address":"${address}"}`,
      ReportMessage.DAMAGE
    );

    response = [await getReplyGeoMessage(), getDamageMessage()];
  } else if (reportMessageType === ReportMessage.DAMAGE && report) {
    const imageId = event.message.type === 'image' ? event.message.id : null;

    let imageUrl = null;
    if (imageId) {
      const image = await lineClient.getMessageContent(imageId);
      imageUrl = await uploadImage(imageId, image);
    }

    const content = imageId
      ? `{"imageId":"${imageId}", "imageUrl": "${imageUrl}"}`
      : `{"imageId": null, "imageUrl": null}`;

    await createReportLog(
      report.id,
      ReportMessage.DAMAGE,
      content,
      ReportMessage.FINISH
    );

    await completeReport(report.id);

    await createContentReport(report.id);

    response = getCompleteMessage();
  } else if (reportMessageType === ReportMessage.FINISH) {
    const report = await getProcessingReport(userId);

    if (report) {
      await deleteReport(report.id);
    }
    response = await getReplyFinishMessage();
  } else if (reportMessageType === ReportMessage.RETRY) {
    response = await getReplyRetryMessage();
  } else {
    response = await getReplyUnknownMessage();
  }

  const { replyToken } = event;

  return await lineClient.replyMessage(replyToken, response);
};
