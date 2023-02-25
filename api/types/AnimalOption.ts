export const AnimalOption = {
  BOAR: {
    option: 'イノシシ',
    content: '{"animal": "boar"}',
  },
  DEER: {
    option: 'シカ',
    content: '{"animal": "deer"}',
  },
  MONKEY: {
    option: 'サル',
    content: '{"animal": "monkey"}',
  },
  OTHER: {
    option: 'その他、わからない',
    content: '{"animal": "other"}',
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
