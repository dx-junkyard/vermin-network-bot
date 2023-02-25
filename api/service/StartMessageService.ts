import { TemplateMessage, TextMessage } from '@line/bot-sdk';

import {
  getProcessingReport,
  initReport,
} from '../repositories/ReportRepository';

export async function getReplyStartMessage(
  userId: string
): Promise<(TextMessage | TemplateMessage)[]> {
  // レポートを初期化する
  const report = await getProcessingReport(userId);

  if (report) {
    return [
      {
        type: 'template',
        altText: 'レポート完了メッセージ',
        template: {
          type: 'confirm',
          text: 'すでに報告を受け付けています。報告を終了しますか？',
          actions: [
            {
              type: 'message',
              label: '終了する',
              text: '終了する',
            },
            {
              type: 'message',
              label: '続ける',
              text: '続ける',
            },
          ],
        },
      },
    ];
  }

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
