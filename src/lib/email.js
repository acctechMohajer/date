import { CONFIG } from "../config";
import { formatDateTime } from "./jalali";

export function sendKey({ email, date, time, food }) {
  return `invite-sent:${email}:${date}:${time}:${food}`;
}

export function alreadySent(key) {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function markSent(key) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function mailBody({ date, time, food }) {
  return [
    "یک پاسخ جدید برای دعوت ثبت شد.",
    `تاریخ و ساعت: ${formatDateTime(date, time)}`,
    `سفارش: ${food.emoji} ${food.name}`,
    `تاریخ میلادی: ${date}`,
    `ساعت: ${time}`,
  ].join("\n");
}

export async function sendInviteEmail({ date, time, food }) {
  const payload = {
    name: "نرگس",
    _subject: `پاسخ دعوت: ${food.name} | ${date} ${time}`,
    _captcha: "false",
    _template: "box",
    date,
    time,
    jalali: formatDateTime(date, time),
    order: `${food.emoji} ${food.name}`,
    message: mailBody({ date, time, food }),
  };

  const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  const msg = String(data.message || "");
  const ok = res.ok && (data.success === true || data.success === "true");
  const needsActivation = /activat|confirm your email|activation link/i.test(
    msg,
  );

  return { ok, needsActivation };
}
