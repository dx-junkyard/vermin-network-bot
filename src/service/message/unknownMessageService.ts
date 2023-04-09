import { Message } from '@line/bot-sdk';

export const getReplyUnknownMessage = (): Message => {
  return {
    type: 'text',
    text: '申し訳ありません。入力を受け付けることができませんでした。',
  };
};
