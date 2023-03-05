import { TemplateMessage, TextMessage } from '@line/bot-sdk';

export const getDamageMessage = (): TemplateMessage => {
  return {
    type: 'template',
    altText: '被害状況の撮影',
    template: {
      type: 'buttons',
      text: '被害の状況写真をお持ちでしたら、送信していただけないでしょうか。',
      actions: [
        {
          type: 'cameraRoll',
          label: 'カメラロールから選択する',
        },
        {
          type: 'camera',
          label: 'カメラから撮影する',
        },
        {
          type: 'message',
          label: '送信しない',
          text: '送信しない',
        },
      ],
    },
  };
};

export async function getReplyDamageMessage(): Promise<TextMessage> {
  return {
    type: 'text',
    text: '被害報告を承りました。\nご報告ありがとうございました。',
  };
}
