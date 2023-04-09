import { Message } from '@line/bot-sdk';

export const getReplyRetryMessage = (): Message[] => {
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
            label: '中断する',
            text: '中断する',
          },
          {
            type: 'message',
            label: 'やり直す',
            text: 'やり直す',
          },
        ],
      },
    },
  ];
};
