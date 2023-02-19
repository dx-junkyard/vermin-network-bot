import { TextMessage } from '@line/bot-sdk';

export function getStartTextMessage(): TextMessage {
  return {
    type: 'text',
    text: '奥多摩町役場です。\n獣害の通報ありがとうございます。\n心よりお見舞い申し上げます。',
  };
}
