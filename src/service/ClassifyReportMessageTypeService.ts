import { EventMessage } from '@line/bot-sdk';
import { Report, ReportLog } from '@prisma/client';

import { ReportMessage, ReportMessageType } from '../types/ReportMessageType';

// FIXME: 直前の投稿済みメッセージを判定条件に追加する
export function classifyReportMessageType(
  report: Report | null,
  log: ReportLog | null,
  eventMessage: EventMessage
): ReportMessageType {
  switch (true) {
    // 報告が存在せず、通報開始メッセージが送られた場合は、通報を開始する
    case !report &&
      eventMessage.type === 'text' &&
      /通報をはじめる/.test(eventMessage.text):
      return ReportMessage.START;
    case report &&
      eventMessage.type === 'text' &&
      log &&
      log.nextScheduledType === ReportMessage.ANIMAL &&
      /サル|イノシシ|シカ|その他、わからない/.test(eventMessage.text):
      return ReportMessage.ANIMAL;
    case report &&
      eventMessage.type === 'location' &&
      log &&
      log.nextScheduledType === ReportMessage.GEO:
      return ReportMessage.GEO;
    case report &&
      (eventMessage.type === 'image' ||
        (eventMessage.type === 'text' &&
          /送信しない/.test(eventMessage.text))) &&
      log &&
      log.nextScheduledType === ReportMessage.DAMAGE:
      return ReportMessage.DAMAGE;
    case eventMessage.type === 'text' &&
      log &&
      /通報を中断する/.test(eventMessage.text):
      return ReportMessage.FINISH;
    // 通報再開メッセージが送られた場合は、通報を再開する
    case eventMessage.type === 'text' &&
      log &&
      /やり直す/.test(eventMessage.text):
      return (
        // 予約済みのメッセージ種別があれば、それを返す
        // なければ、通報開始メッセージを返す
        (log?.nextScheduledType as ReportMessageType) || ReportMessage.START
      );
    case !!report:
      return ReportMessage.RETRY;
    default:
      return ReportMessage.UNDEFINED;
  }
}
