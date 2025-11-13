/**
 * UTC 시간을 한국 시간(KST) 기준으로 포맷
 * @param {string | Date} utcTime - UTC 시간 문자열 또는 Date 객체
 * @returns {string} YYYY-MM-DD HH:mm:SS 형식의 KST 시간
 */
export const formatKST = (utcTime) => {
  const date = typeof utcTime === "string" ? new Date(utcTime) : utcTime;
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const formatted = `${kstDate.getFullYear()}-${String(kstDate.getMonth() + 1).padStart(2, "0")}-${String(kstDate.getDate()).padStart(2, "0")} ${String(kstDate.getHours()).padStart(2, "0")}:${String(kstDate.getMinutes()).padStart(2, "0")}:${String(kstDate.getSeconds()).padStart(2, "0")}`;

  return formatted;
};