import { TextMessage } from '@line/bot-sdk';

export async function getReplyFinishMessage(): Promise<TextMessage> {
  return {
    type: 'text',
    text: '報告作業を中止しました。',
  };
}
