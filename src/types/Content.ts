import { ReportLog } from '@prisma/client';

export type ContentJson = {
  animal: string | undefined;
  damage: string | undefined;
  address: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  imageId: string | undefined;
  imageUrl: string | undefined;
};

export const getElementByType = (
  type: string,
  array: ReportLog[]
): ContentJson => {
  const jsonValue = array
    .sort()
    .find((element) => element.reportType === type)?.content;
  return jsonValue as ContentJson;
};
