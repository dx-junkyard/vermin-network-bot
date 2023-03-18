import { PrismaClient, ReportContent } from '@prisma/client';

const prisma = new PrismaClient();

export type ReportResult = ReportContent & {
  report: {
    user: {
      id: number;
    };
  };
};

export const getReportContentList = async (
  from: Date | undefined,
  to: Date | undefined
): Promise<ReportResult[]> => {
  return await prisma.reportContent.findMany({
    where: {
      // 期間で絞り込み
      createdAt: {
        gte: from,
        lte: to,
      },
      report: {
        isDeleted: false,
      },
    },
    // 更新日時が最新のレポートを取得
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      updatedAt: true,
      createdAt: true,
      animal: true,
      damage: true,
      latitude: true,
      longitude: true,
      locationName: true,
      reportId: true,
      report: {
        select: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export const getUnnotifiedEarliestReportContent = async (): Promise<
  ReportContent | undefined
> => {
  return (
    (await prisma.reportContent.findFirst({
      where: {
        report: {
          isNotified: false,
          isCompleted: true,
          isDeleted: false,
        },
      },
      // 更新日時が一番古いレポートを取得
      orderBy: {
        createdAt: 'asc',
      },
    })) || undefined
  );
};
