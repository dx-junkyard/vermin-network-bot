import { TemplateMessage, TextEventMessage, TextMessage } from '@line/bot-sdk';

import {
  AnimalOption,
  AnimalOptionType,
  getAnimalOption,
} from '../types/AnimalOption';

export function getReployFromAnimalMessage(
  eventMessage: TextEventMessage
): (TextMessage | TemplateMessage)[] {
  const { text } = eventMessage;

  const animalOption = getAnimalOption(text);
  const animalText = getReplyText(animalOption);

  return [
    {
      type: 'text',
      text: animalText,
    },
    {
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
          // {
          //   type: 'message',
          //   label: '位置情報送らない',
          //   text: '位置情報送らない',
          // },
        ],
      },
    },
  ];
}

const getReplyText = (animalOption: AnimalOptionType): string => {
  switch (animalOption) {
    case AnimalOption.BOAR:
    case AnimalOption.DEER:
    case AnimalOption.MONKEY:
      return `${animalOption.option}の被害ですね。承りました。`;
    case AnimalOption.OTHER:
    default:
      return '害獣は不明として承りました。';
  }
};
