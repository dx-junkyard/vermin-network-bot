export const AnimalOption = {
  BOAR: {
    option: 'イノシシ',
  },
  DEER: {
    option: 'シカ',
  },
  MONKEY: {
    option: 'サル',
  },
  OTHER: {
    option: 'その他、わからない',
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
