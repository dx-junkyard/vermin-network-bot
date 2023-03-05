import { TemplateMessage, TextMessage } from '@line/bot-sdk';

import {
  AnimalOption,
  AnimalOptionType,
  getAnimalOption,
} from '../../types/AnimalOption';

/**
 * 害獣の選択肢メッセージに対する返信を取得する
 *
 * @param reportId 通報ID
 * @param eventMessage
 * @returns
 */
export const getReployAnimalMessage = async (
  text: string
): Promise<TextMessage> => {
  const animalOption = getAnimalOption(text);
  const animalText = getReplyText(animalOption);

  return {
    type: 'text',
    text: animalText,
  };
};

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

export const getAnimalOptionMessage = (): TemplateMessage => {
  return {
    type: 'template',
    altText: 'どの動物の被害をうけましたか？',
    template: {
      type: 'buttons',
      text: 'どの動物の被害をうけましたか？',
      actions: [
        {
          type: 'message',
          label: AnimalOption.BOAR.option,
          text: AnimalOption.BOAR.option,
        },
        {
          type: 'message',
          label: AnimalOption.DEER.option,
          text: AnimalOption.DEER.option,
        },
        {
          type: 'message',
          label: AnimalOption.MONKEY.option,
          text: AnimalOption.MONKEY.option,
        },
        {
          type: 'message',
          label: AnimalOption.OTHER.option,
          text: AnimalOption.OTHER.option,
        },
      ],
    },
  };
};
