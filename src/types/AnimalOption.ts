import { ContentJson } from './Content';

export const AnimalOption = {
  BOAR: {
    option: 'イノシシ',
    content: { animal: 'boar' } as ContentJson,
    keyword: 'boar',
    title: 'イノシシの被害',
  },
  DEER: {
    option: 'シカ',
    content: { animal: 'deer' } as ContentJson,
    keyword: 'deer',
    title: 'シカの被害',
  },
  MONKEY: {
    option: 'サル',
    content: { animal: 'monkey' } as ContentJson,
    keyword: 'monkey',
    title: 'サルの被害',
  },
  OTHER: {
    option: 'その他、わからない',
    content: { animal: 'other' } as ContentJson,
    keyword: 'other',
    title: 'その他の被害',
  },
} as const;

export type AnimalOptionType = (typeof AnimalOption)[keyof typeof AnimalOption];

export function getAnimalOption(text: string): AnimalOptionType {
  switch (true) {
    case /イノシシ/.test(text):
      return AnimalOption.BOAR;
    case /シカ/.test(text):
      return AnimalOption.DEER;
    case /サル/.test(text):
      return AnimalOption.MONKEY;
    case /その他、わからない/.test(text):
    default:
      return AnimalOption.OTHER;
  }
}

export function getAnimalOptionByKeyword(keyword: string): AnimalOptionType {
  switch (true) {
    case /boar/.test(keyword):
      return AnimalOption.BOAR;
    case /deer/.test(keyword):
      return AnimalOption.DEER;
    case /monkey/.test(keyword):
      return AnimalOption.MONKEY;
    case /other/.test(keyword):
    default:
      return AnimalOption.OTHER;
  }
}
