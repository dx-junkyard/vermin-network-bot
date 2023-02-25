import {
  Client,
  ClientConfig,
  Message,
  MessageAPIResponseBase,
  TextEventMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import dotenv from 'dotenv';

import { getReployAnimalMessage } from '../../service/AnimalMessageService';
import { classifyReportMessageType } from '../../service/ClassifyReportMessageTypeService';
import { getReplyDamageMessage } from '../../service/DamageMessageService';
import { getReplyGeoMessage } from '../../service/GeoMessageService';
import { getReplyStartMessage } from '../../service/StartMessageService';
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
  // Process all variables here.
  if (
    event.type !== 'message' ||
    // FIXME: 条件を簡潔に実装する
    (event.message.type !== 'text' &&
      event.message.type !== 'image' &&
      event.message.type !== 'location')
  ) {
    // FIXME: 未対応のメッセージタイプの場合に返すメッセージを検討する
    return;
  }

  const userId = event.source.userId;
  if (!userId) {
    // FIXME: ユーザIDが取得できなかった場合に返すメッセージを検討する
    return;
  }

  // Process all message related variables here.
  const { replyToken } = event;

  const reportMessageType = classifyReportMessageType(event.message);

  let response: Message | Message[];

  switch (reportMessageType) {
    case ReportMessage.START:
      response = await getReplyStartMessage(userId);
      break;
    case ReportMessage.ANIMAL:
      response = getReployAnimalMessage(event.message as TextEventMessage);
      break;
    case ReportMessage.GEO:
      response = getReplyGeoMessage();
      break;
    case ReportMessage.DAMAGE:
      response = getReplyDamageMessage();
      break;
    case ReportMessage.UNDEFINED:
    default:
      response = {
        type: 'text',
        // FIXME: 入力が分類できなかった場合のメッセージを検討する
        text: '申し訳ありません。入力を受け付けることができませんでした。',
      };
  }
  await lineClient.replyMessage(replyToken, response);
};
