import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { MONTHS, WEEKDAYS } from "../config";

export { persian, persian_fa };

function pad(n) {
  return String(n).padStart(2, "0");
}

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function gregorianToJalali(gy, gm, gd) {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    gdm[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

export function formatDateTime(dateValue, timeValue) {
  const [y, m, d] = dateValue.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const [, jm, jd] = gregorianToJalali(y, m, d);
  const weekday = WEEKDAYS[dt.getDay()];
  const [hh, mm] = timeValue.split(":");
  return `${weekday} ${jd} ${MONTHS[jm - 1]} ساعت ${hh}:${mm}`;
}

export function defaultDate() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return toISODate(t);
}

export function defaultPickerDate() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return new DateObject({
    date: t,
    calendar: persian,
    locale: persian_fa,
  });
}

export function dateObjectFromISO(iso) {
  if (!iso) return defaultPickerDate();
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return defaultPickerDate();
  return new DateObject({
    date: new Date(y, m - 1, d),
    calendar: persian,
    locale: persian_fa,
  });
}

export function isoFromDateObject(value) {
  if (!value) return "";
  return toISODate(value.toDate());
}
