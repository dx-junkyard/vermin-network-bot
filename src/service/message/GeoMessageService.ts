import { TemplateMessage, TextMessage } from '@line/bot-sdk';

export const getGeoMessage = (): TemplateMessage => {
  return {
    type: 'template',
    altText: '位置情報',
    template: {
      type: 'buttons',
      text: '被害を受けた場所の位置情報を地図から選択してください。',
      actions: [
        {
          type: 'location',
          label: '位置情報を送信する',
        },
      ],
    },
  };
};

export const getReplyGeoMessage = (): TextMessage => {
  return {
    type: 'text',
    text: '位置情報を承りました。',
  };
};
