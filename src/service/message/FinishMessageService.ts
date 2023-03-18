import { TextMessage } from '@line/bot-sdk';

export const getReplyFinishMessage = (): TextMessage => {
  return {
    type: 'text',
    text: '報告作業を中止しました。',
  };
};
