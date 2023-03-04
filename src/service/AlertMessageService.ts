import {
  FlexCarousel,
  FlexMessage,
  TemplateMessage,
  TextMessage,
} from '@line/bot-sdk';
import { ReportContent } from '@prisma/client';

import {
  AnimalOption,
  getAnimalOption,
  getAnimalOptionByKeyword,
} from '../types/AnimalOption';

export const getAlertMessage = async (
  reports: ReportContent[]
): Promise<TextMessage> => {
  const message = reports
    .map((report) => {
      return `${report.address}で${
        getAnimalOptionByKeyword(report.animal).title
      }の被害が発生しました。`;
    })
    .join('\n\n');

  return {
    type: 'text',
    text: '最新の獣害報告をお知らせします。\n\n' + message,
  };
};
