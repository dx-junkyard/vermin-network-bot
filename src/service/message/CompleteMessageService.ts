import { Message } from '@line/bot-sdk';

export const getCompleteMessage = (): Message[] => {
  return [
    {
      type: 'text',
      text: '被害報告を承りました。\nご報告ありがとうございました。',
    },
    {
      type: 'sticker',
      packageId: '11537',
      stickerId: '52002739',
    },
    {
      type: 'text',
      text: '周辺にお住まいの方にもご注意いただくため、今回の被害発生についてLINE登録の皆様にお知らせします。\nまた今後、役場より周辺のパトロールを行います。\n通報にご協力いただきありがとうございました。',
    },
  ];
};
