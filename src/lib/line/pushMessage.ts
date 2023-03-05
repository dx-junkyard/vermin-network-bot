import { Client, ClientConfig, TextMessage } from '@line/bot-sdk';
import dotenv from 'dotenv';

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

export const pushExpireMessage = async (userId: string): Promise<boolean> => {
  const message = {
    type: 'text',
    text: '通報を開始して一定時間が経過したため、報告作業を中断しました。\n再度報告する場合は、メニューから報告を開始してください。',
  } as TextMessage;
  try {
    await lineClient.pushMessage(userId, message);
  } catch (error) {
    console.error(error);
    return false;
  }

  return true;
};
