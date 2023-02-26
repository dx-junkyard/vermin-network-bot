import { TemplateMessage, TextMessage } from '@line/bot-sdk';

export const getReplyRetryMessage = async (): Promise<
  (TextMessage | TemplateMessage)[]
> => {
  return [
    {
      type: 'template',
      altText: '問題が発生したため、報告を中断します。',
      template: {
        type: 'confirm',
        text: '問題が発生したため、報告を中断します。報告をやり直しますか？',
        actions: [
          {
            type: 'message',
            label: '報告する',
            text: '報告する',
          },
          {
            type: 'message',
            label: '続ける',
            text: '終了する',
          },
        ],
      },
    },
  ];
};
