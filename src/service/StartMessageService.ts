import { TemplateMessage, TextMessage } from '@line/bot-sdk';

import { initReport } from '../repositories/ReportRepository';

export async function getReplyStartMessage(
  userId: string
): Promise<(TextMessage | TemplateMessage)[]> {
  // レポートを初期化する
  await initReport(userId);

  return [
    {
      type: 'text',
      text: `奥多摩町役場です。\n獣害の通報ありがとうございます。\n心よりお見舞い申し上げます。`,
    },
    {
      type: 'template',
      altText: '獣害報告開始',
      template: {
        type: 'buttons',
        text: 'どの動物の被害をうけましたか？',
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
    },
  ];
}