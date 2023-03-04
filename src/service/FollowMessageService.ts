import { TextMessage } from '@line/bot-sdk';

export const message = [
  'こんにちは！害獣被害報告ネットワーク【奥多摩町】です。',
  'このbotでは、害獣被害の報告と通知機能を提供しています。',
  '報告する際には、被害の場所や、写真などをお知らせください。それにより、被害の把握や対策に役立てています。',
  'また、通知機能では、被害の報告があった場合に近隣の利用者に通知を送信することができます。これにより、早期に被害対策を行うことができます。',
  '何か困ったことがあれば、いつでもご連絡ください。よろしくお願いします。',
].join('\n\n');

export const getFollowMessage = async (): Promise<TextMessage> => {
  return {
    type: 'text',
    text: message,
  };
};
