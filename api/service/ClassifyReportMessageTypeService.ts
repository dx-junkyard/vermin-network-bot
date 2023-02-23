import {
  ImageEventMessage,
  LocationEventMessage,
  TextEventMessage,
} from '@line/bot-sdk';

import { ReportMessage, ReportMessageType } from '../types/ReportMessageType';

// FIXME: 直前の投稿済みメッセージを判定条件に追加する
export function classifyReportMessageType(
  eventMessage: TextEventMessage | ImageEventMessage | LocationEventMessage
): ReportMessageType {
  if (eventMessage.type == 'text') {
    const { text } = eventMessage;
    // FIXME: メッセージをグローバルに管理
    switch (true) {
      case /通報をはじめる/.test(text):
        return ReportMessage.START;
      case /イノシシ|シカ|サル|その他、わからない/.test(text):
        return ReportMessage.ANIMAL;
      case /送信しない/.test(text):
        return ReportMessage.DAMAGE;
      default:
        return ReportMessage.UNDEFINED;
    }
  } else if (eventMessage.type == 'image') {
    return ReportMessage.DAMAGE;
  } else if (eventMessage.type == 'location') {
    return ReportMessage.GEO;
  }

  return ReportMessage.UNDEFINED;
}
