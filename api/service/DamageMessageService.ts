import { TemplateMessage, TextMessage } from '@line/bot-sdk';

export function getReplyDamageMessage(): (TextMessage | TemplateMessage)[] {
  return [
    {
      type: 'text',
      text: '被害報告を承りました。\nご報告ありがとうございました。',
    },
    {
      type: 'text',
      text: '周辺にお住まいの方にもご注意いただくため、今回の被害発生についてLINE登録の皆様にお知らせします。\nまた今後、役場より周辺のパトロールを行います。\n通報にご協力いただきありがとうございました。',
    },
  ];
}
