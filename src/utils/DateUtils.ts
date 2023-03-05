export function convertUTCtoJST(utcDate: Date): Date {
  const jstOffset = 9 * 60; // JSTはUTC+9時間
  const jstTime = utcDate.getTime() + jstOffset * 60 * 1000;
  const jstDate = new Date(jstTime);
  return jstDate;
}
