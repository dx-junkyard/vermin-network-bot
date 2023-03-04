import { Message } from '@line/bot-sdk';

export const getReplyUnknownMessage = async (): Promise<Message> => {
  return {
    type: 'text',
    // FIXME: 入力が分類できなかった場合のメッセージを検討する
    text: '申し訳ありません。入力を受け付けることができませんでした。',
  };
};
