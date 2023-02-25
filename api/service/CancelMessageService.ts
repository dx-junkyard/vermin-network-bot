import { TemplateMessage, TextMessage } from '@line/bot-sdk';

export const getReplyCancelMessage = async (): Promise<
  (TextMessage | TemplateMessage)[]
> => {
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
};
