import { TemplateMessage } from '@line/bot-sdk';

const messages = [
  '奥多摩町役場です。',
  '獣害の通報ありがとうございます。',
  '心よりお見舞い申し上げます。',
  '',
  'どの動物の被害をうけましたか？',
];

export function getStartTextMessage(): TemplateMessage {
  return {
    type: 'template',
    altText: '獣害報告開始',
    template: {
      type: 'buttons',
      text: messages.join(', '),
      actions: [
        {
          type: 'message',
          label: 'イノシシ',
          text: 'イノシシ',
        },
        {
          type: 'message',
          label: 'シカ',
          text: 'シカ',
        },
        {
          type: 'message',
          label: 'サル',
          text: 'サル',
        },
        {
          type: 'message',
          label: 'その他、わからない',
          text: 'その他、わからない',
        },
      ],
    },
  };
}
