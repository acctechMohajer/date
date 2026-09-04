import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config";
import { formatDateTime } from "../lib/jalali";

function letterLines(date, time, food) {
  const when = formatDateTime(date, time);
  return [
    CONFIG.letterGreeting,
    `پس ${when}`,
    `میام دنبالت، برای ${food.name} ${food.emoji}`,
    "خودم میام دنبالت.",
    CONFIG.letterSign,
  ];
}

function later(ms, timers) {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    timers.current.push(id);
  });
}

function typeLine(el, text, quill, alive, timers) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = "";
    const tick = () => {
      if (!alive.current) return resolve();
      i += 1;
      el.textContent = text.slice(0, i);
      if (quill) {
        const lineTop = el.offsetTop + 6;
        quill.style.top = `${lineTop}px`;
      }
      if (i < text.length) {
        const pause = /[،.!؟]/.test(text[i - 1]) ? 90 : 34;
        const id = setTimeout(tick, pause);
        timers.current.push(id);
      } else {
        resolve();
      }
    };
    tick();
  });
}

export default function LetterStep({ date, time, food, onDone, burst }) {
  const lines = letterLines(date, time, food);
  const [caption, setCaption] = useState(CONFIG.letterCaptionWrite);
  const [paperClass, setPaperClass] = useState("paper");
  const [envelopeClass, setEnvelopeClass] = useState("envelope");
  const [quillOn, setQuillOn] = useState(false);
  const lineRefs = useRef([]);
  const quillRef = useRef(null);
  const timers = useRef([]);
  const alive = useRef(true);

  useEffect(() => {
    const script = letterLines(date, time, food);
    alive.current = true;
    timers.current = [];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return () => {
        alive.current = false;
      };
    }

    async function playLetter() {
      await later(80, timers);
      if (!alive.current) return;
      setPaperClass("paper is-in");
      setEnvelopeClass("envelope is-ready");
      setQuillOn(true);
      setCaption(CONFIG.letterCaptionWrite);

      for (let i = 0; i < script.length; i += 1) {
        if (!alive.current) return;
        const el = lineRefs.current[i];
        if (el) {
          await typeLine(el, script[i], quillRef.current, alive, timers);
        }
        await later(160, timers);
      }

      if (!alive.current) return;
      setQuillOn(false);
      await later(520, timers);

      if (!alive.current) return;
      setCaption(CONFIG.letterCaptionFold);
      setPaperClass("paper is-in is-folding");
      await later(780, timers);

      if (!alive.current) return;
      setCaption(CONFIG.letterCaptionInsert);
      setEnvelopeClass("envelope is-ready is-focus");
      setPaperClass("paper is-in is-inserting");
      await later(980, timers);

      if (!alive.current) return;
      setCaption(CONFIG.letterCaptionClose);
      setPaperClass("paper is-in is-inserting is-hidden");
      setEnvelopeClass("envelope is-ready is-focus is-closed");
      await later(860, timers);

      if (!alive.current) return;
      setCaption(CONFIG.letterCaptionWax);
      setEnvelopeClass("envelope is-ready is-focus is-closed is-dripping");
      await later(540, timers);

      if (!alive.current) return;
      setEnvelopeClass(
        "envelope is-ready is-focus is-closed is-dripping is-sealed",
      );
      setCaption(CONFIG.letterCaptionDone);
      await later(1450, timers);

      if (!alive.current) return;
      onDone();
    }

    playLetter();

    return () => {
      alive.current = false;
      while (timers.current.length) clearTimeout(timers.current.pop());
    };
  }, [date, time, food, onDone]);

  return (
    <>
      <p className="ceremony-kicker">{CONFIG.letterKicker}</p>
      <div className="desk">
        <div className={paperClass}>
          {lines.map((_, i) => (
            <p
              key={i}
              className={`paper-line${i === lines.length - 1 ? " sign" : ""}`}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
            />
          ))}
          <div
            className={`quill${quillOn ? " is-on" : ""}`}
            ref={quillRef}
          >
            🪶
          </div>
        </div>
        <div className={envelopeClass}>
          <div className="env-back" />
          <div className="env-flap" />
          <div className="env-front" />
          <div className="wax-drop" />
          <div className="wax-seal">
            <span>♥</span>
          </div>
        </div>
      </div>
      <p className="ceremony-caption">{caption}</p>
      <button
        className="btn btn-ghost"
        type="button"
        onClick={(e) => {
          burst(e.clientX, e.clientY);
          onDone();
        }}
      >
        {CONFIG.skipLetter}
      </button>
    </>
  );
}
