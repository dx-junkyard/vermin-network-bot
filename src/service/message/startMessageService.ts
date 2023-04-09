import { TextMessage } from '@line/bot-sdk';

/**
 * 開始時の返信メッセージを取得する
 *
 * @returns 開始時の返信メッセージ
 */
export const getReplyStartMessage = (): TextMessage => {
  return {
    type: 'text',
    text: `奥多摩町役場です。\n獣害の通報ありがとうございます。\n心よりお見舞い申し上げます。`,
  };
};
