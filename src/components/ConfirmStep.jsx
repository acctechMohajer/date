import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { formatDateTime } from "../lib/jalali";
import {
  alreadySent,
  sendInviteOnce,
  sendKey,
} from "../lib/email";

function sendButtonLabel(sent, sending) {
  if (sent) return "ارسال شد 💌";
  if (sending) return "داره میره...";
  return "دوباره بفرست ☁️";
}

export default function ConfirmStep({ date, time, food, burst }) {
  const key = sendKey({
    email: CONFIG.email,
    date,
    time,
    food: food.id,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(() => alreadySent(key));
  const [mailStatus, setMailStatus] = useState(
    alreadySent(key)
      ? "جزئیات دیت ایمیل شد 💌"
      : "داره جزئیات دیت خودکار ایمیل میشه...",
  );
  const busy = useRef(false);

  async function sendEmail() {
    if (!food || sent || busy.current) return;
    busy.current = true;

    setSending(true);
    setMailStatus("داره جزئیات دیت خودکار ایمیل میشه...");

    try {
      const { ok, needsActivation } = await sendInviteOnce({
        date,
        time,
        food,
      });

      if (ok && !needsActivation) {
        setSent(true);
        setMailStatus("جزئیات دیت ایمیل شد 💌");
        return;
      }

      if (needsActivation) {
        setMailStatus(
          "اولین ارساله. برو جیمیل (و پوشهٔ Spam) لینک Activate Form را بزن؛ بعد همین‌جا دوباره بفرست.",
        );
        return;
      }

      throw new Error("send-failed");
    } catch {
      setMailStatus("ارسال خودکار گیر کرد. دکمه را بزن تا دوباره تلاش کنم.");
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (alreadySent(key)) {
        setSent(true);
        setMailStatus("جزئیات دیت ایمیل شد 💌");
        setSending(false);
        return;
      }

      setSending(true);
      setMailStatus("داره جزئیات دیت خودکار ایمیل میشه...");

      try {
        const { ok, needsActivation } = await sendInviteOnce({
          date,
          time,
          food,
        });
        if (cancelled) return;

        if (ok && !needsActivation) {
          setSent(true);
          setMailStatus("جزئیات دیت ایمیل شد 💌");
          return;
        }

        if (needsActivation) {
          setMailStatus(
            "اولین ارساله. برو جیمیل (و پوشهٔ Spam) لینک Activate Form را بزن؛ بعد همین‌جا دوباره بفرست.",
          );
          return;
        }

        throw new Error("send-failed");
      } catch {
        if (!cancelled) {
          setMailStatus(
            "ارسال خودکار گیر کرد. دکمه را بزن تا دوباره تلاش کنم.",
          );
        }
      } finally {
        if (!cancelled) setSending(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [key, date, time, food]);

  const when = formatDateTime(date, time);

  return (
    <>
      <div className="mini-envelope" aria-hidden="true">
        <i />
        <em />
        <b />
      </div>
      <h1>{CONFIG.confirmTitle}</h1>
      <div className="result">
        پس {when} میام دنبالت، برای {food.name} {food.emoji} 🥂
      </div>
      <p className="sub">{CONFIG.pickupText}</p>
      <button
        className="btn btn-primary"
        type="button"
        disabled={sending || sent}
        onClick={(e) => {
          burst(e.clientX, e.clientY);
          sendEmail();
        }}
      >
        {sendButtonLabel(sent, sending)}
      </button>
      <p className="status">{mailStatus}</p>
      <p className="note">{CONFIG.confirmFooter}</p>
    </>
  );
}
