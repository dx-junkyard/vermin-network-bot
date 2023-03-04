import { TextMessage } from '@line/bot-sdk';

export const message = [
  'こんにちは！害獣被害報告ネットワーク【奥多摩町】です。',
  'このアカウントでは、害獣被害の報告と通知機能を提供しています。',
  '報告する際には、被害の場所や、写真などをお知らせください。それにより、被害の把握や対策に役立てています。',
].join('\n\n');

export const getFollowMessage = async (): Promise<TextMessage> => {
  return {
    type: 'text',
    text: message,
  };
};
