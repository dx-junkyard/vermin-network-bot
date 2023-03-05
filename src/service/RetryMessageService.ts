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
            label: 'やり直す',
            text: 'やり直す',
          },
          {
            type: 'message',
            label: '通報を中断する',
            text: '通報を中断する',
          },
        ],
      },
    },
  ];
};
