import { TextMessage } from '@line/bot-sdk';

import { logger } from '../log4js/logger';
import { lineClient } from './LineClient';

export const pushExpireMessage = async (userId: string): Promise<boolean> => {
  const message = {
    type: 'text',
    text: '通報を開始して一定時間が経過したため、報告作業を中断しました。\n再度報告する場合は、メニューから報告を開始してください。',
  } as TextMessage;
  try {
    await lineClient.pushMessage(userId, message);
  } catch (error) {
    logger.error(error);
    return false;
  }

  return true;
};
