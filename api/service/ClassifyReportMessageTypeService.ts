import {
  ImageEventMessage,
  LocationEventMessage,
  TextEventMessage,
} from '@line/bot-sdk';
import { ReportMessageType } from 'types/ReportMessageType';

export function classifyReportMessageType(
  eventMessage: TextEventMessage | ImageEventMessage | LocationEventMessage
): ReportMessageType {
  if (eventMessage.type == 'text') {
    const { text } = eventMessage;

    switch (true) {
      case /通報をはじめる/.test(text):
        return 'Start';
      case /イノシシ|シカ|サル/.test(text):
        return 'AnimalType';
      default:
        return 'Undefined';
    }
  }

  // TODO: 位置情報の分類を実装する

  // TODO: 画像の分類を実装する

  return 'Undefined';
}
