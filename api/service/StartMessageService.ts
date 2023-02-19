import { TextMessage } from '@line/bot-sdk';

const messages = [
  '奥多摩町役場です。',
  '獣害の通報ありがとうございます。',
  '心よりお見舞い申し上げます。',
];

export function getStartTextMessage(): TextMessage {
  return {
    type: 'text',
    text: messages.join('\n'),
  };
}
