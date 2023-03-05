import { FlexImage, Message } from '@line/bot-sdk';
import { ReportContent } from '@prisma/client';

import { getAnimalOptionByKeyword } from '../types/AnimalOption';

export const getAlertMessage = async (
  report: ReportContent
): Promise<Message[]> => {
  const hero =
    report.damage && report.damage.startsWith('https://')
      ? ({
          type: 'image',
          url: report.damage,
          size: 'full',
          aspectRatio: '20:13',
          aspectMode: 'cover',
        } as FlexImage)
      : undefined;

  return [
    {
      type: 'flex',
      altText: '最新の獣害報告情報をお送りします',
      contents: {
        type: 'bubble',
        hero: hero,
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: getAnimalOptionByKeyword(report.animal).title,
              weight: 'bold',
              size: 'xl',
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '発生場所',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text: report.address,
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 5,
                    },
                  ],
                },
                {
                  type: 'box',
                  layout: 'baseline',
                  spacing: 'sm',
                  contents: [
                    {
                      type: 'text',
                      text: '通報時刻',
                      color: '#aaaaaa',
                      size: 'sm',
                      flex: 2,
                    },
                    {
                      type: 'text',
                      text: report.createdAt.toLocaleString(),
                      wrap: true,
                      color: '#666666',
                      size: 'sm',
                      flex: 5,
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
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
