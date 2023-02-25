import {
  LocationEventMessage,
  TemplateMessage,
  TextMessage,
} from '@line/bot-sdk';

import { createReportLog } from '../repositories/ReportLogRepository';
import { ReportMessage } from '../types/ReportMessageType';

export async function getReplyGeoMessage(
  reportId: number,
  eventMessage: LocationEventMessage
): Promise<(TextMessage | TemplateMessage)[]> {
  const { latitude, longitude } = eventMessage;

  await createReportLog(
    reportId,
    ReportMessage.GEO,
    `{"latitude", ${latitude},"longitude", ${longitude}}`
  );

  return [
    {
      type: 'text',
      text: '位置情報を承りました。',
    },
    {
      type: 'template',
      altText: '被害状況の撮影',
      template: {
        type: 'buttons',
        text: '被害の状況写真をお持ちでしたら、送信していただけないでしょうか。',
        actions: [
          {
            type: 'cameraRoll',
            label: 'カメラロールから選択する',
          },
          {
            type: 'camera',
            label: 'カメラから撮影する',
          },
          {
            type: 'message',
            label: '送信しない',
            text: '送信しない',
          },
        ],
      },
    },
  ];
}
