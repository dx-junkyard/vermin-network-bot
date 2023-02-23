import {
  ImageEventMessage,
  LocationEventMessage,
  TextEventMessage,
} from '@line/bot-sdk';

import { ReportMessageType } from '../types/ReportMessageType';

// FIXME: 直前の投稿済みメッセージを判定条件に追加する
export function classifyReportMessageType(
  eventMessage: TextEventMessage | ImageEventMessage | LocationEventMessage
): ReportMessageType {
  if (eventMessage.type == 'text') {
    const { text } = eventMessage;
    // FIXME: メッセージをグローバルに管理
    switch (true) {
      case /通報をはじめる/.test(text):
        return 'Start';
      case /イノシシ|シカ|サル|その他、わからない/.test(text):
        return 'Animal';
      default:
        return 'Undefined';
    }
  } else if (eventMessage.type == 'image') {
    return 'Damage';
  } else if (eventMessage.type == 'location') {
    return 'Geo';
  }

  return 'Undefined';
}
