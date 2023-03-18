export const convertUTCtoJST = (utcDate: Date): Date => {
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  const jstTime = utcDate.getTime() + jstOffset * 60 * 1000;
  const jstDate = new Date(jstTime);
  return jstDate;
};

export const toDate = (dateString: string): Date => {
  return new Date(
    `${dateString.substring(0, 4)}-${dateString.substring(
      4,
      6
    )}-${dateString.substring(6, 8)}`
  );
};
