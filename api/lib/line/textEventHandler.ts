import {
  Client,
  ClientConfig,
  MessageAPIResponseBase,
  TextMessage,
  WebhookEvent,
} from '@line/bot-sdk';
import dotenv from 'dotenv';
import { classifyReportMessageType } from 'service/ClassifyReportMessageTypeService';
import { getReportMessage } from 'types/message';
import { getReportMessageType } from 'types/ReportMessageType';

if (process.env.NODE_ENV == 'development') {
  dotenv.config();
}

// Setup all LINE client and Express configurations.
const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET,
};

// Create a new LINE SDK client.
const client = new Client(clientConfig);

// Function handler to receive the text.
export const textEventHandler = async (
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
    return;
  }

  // Process all message related variables here.
  const { replyToken } = event;

  const reportMessageType = classifyReportMessageType(event.message);

  let response: TextMessage;

  if (reportMessageType == 'Start') {
    response = {
      type: 'text',
      text: '奥多摩町役場です。獣害の通報ありがとうございます。心よりお見舞い申し上げます。',
    };
  } else {
    response = {
      type: 'text',
      // FIXME: 入力が分類できなかった場合のメッセージを検討する
      text: '申し訳ありません。入力を受け付けることができませんでした。',
    };
  }

  // Reply to the user.
  await client.replyMessage(replyToken, response);
};
