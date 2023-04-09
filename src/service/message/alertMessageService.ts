import { Message } from '@line/bot-sdk';
import { ReportContent } from '@prisma/client';

import { getAnimalOptionByKeyword } from '../../types/animalOption';
import { convertUTCtoJST } from '../../utils/dateUtils';

export const getAlertMessage = async (
  report: ReportContent
): Promise<Message[]> => {
  const createdAt = convertUTCtoJST(report.createdAt);

  return [
    {
      type: 'sticker',
      packageId: '11537',
      stickerId: '52002749',
    },
    {
      type: 'text',
      text: `本日${createdAt.getHours()}時${createdAt.getMinutes()}分に、\n${
        report.locationName
      }において、${
        getAnimalOptionByKeyword(report.animal).title
      }の報告がありました。\n\n周辺の地域の方は\n改めて柵やフェンスが破損してないか点検し、\n被害防止に努めるようにしてください。`,
    },
    {
      type: 'location',
      title: '被害発生場所',
      address: report.locationName,
      latitude: report.latitude,
      longitude: report.longitude,
    },
  ];
};
