import { Message } from '@line/bot-sdk';
import { ReportContent } from '@prisma/client';

import { getAnimalOptionByKeyword } from '../types/AnimalOption';
import { convertUTCtoJST } from '../utils/DateUtils';

export const getAlertMessage = async (
  report: ReportContent
): Promise<Message[]> => {
  const createdAt = convertUTCtoJST(report.createdAt);

  return [
    {
      type: 'text',
      text: `本日${createdAt.getHours()}時${createdAt.getMinutes()}分に、\n${
        report.address
      }において、${
        getAnimalOptionByKeyword(report.animal).title
      }の報告がありました。\n\n周辺の地域の方は\n改めて柵やフェンスが破損してないか点検し、\n被害防止に努めるようにしてください。`,
    },
    {
      type: 'location',
      title: '被害発生場所',
      address: report.address,
      latitude: report.latitude,
      longitude: report.longitude,
    },
  ];
};
