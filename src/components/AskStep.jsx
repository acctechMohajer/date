import { useLayoutEffect, useRef, useState } from "react";
import { CONFIG, NO_TEASES } from "../config";

export default function AskStep({ onYes, burst }) {
  const boxRef = useRef(null);
  const noRef = useRef(null);
  const yesRef = useRef(null);
  const [noPos, setNoPos] = useState({ left: 18, top: 56 });
  const [noScale, setNoScale] = useState(1);
  const [yesScale, setYesScale] = useState(1);
  const [noTries, setNoTries] = useState(0);
  const [noDisabled, setNoDisabled] = useState(false);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const noBtn = noRef.current;
    if (!box || !noBtn) return;
    setNoPos({
      left: 18,
      top: box.clientHeight / 2 - noBtn.offsetHeight / 2,
    });
  }, []);

  const noLabel = noDisabled
    ? "بیخیال 😅"
    : NO_TEASES[Math.min(noTries, NO_TEASES.length - 1)];

  function moveNoButton() {
    const box = boxRef.current;
    const noBtn = noRef.current;
    const yesBtn = yesRef.current;
    if (!box || !noBtn) return;

    const pad = 8;
    const maxX = Math.max(pad, box.clientWidth - noBtn.offsetWidth - pad);
    const maxY = Math.max(pad, box.clientHeight - noBtn.offsetHeight - pad);
    let x = Math.random() * maxX;
    let y = Math.random() * maxY;

    if (yesBtn) {
      const yes = yesBtn.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const yesLeft = yes.left - boxRect.left;
      const yesTop = yes.top - boxRect.top;
      const overlaps =
        x < yesLeft + yes.width + 12 &&
        x + noBtn.offsetWidth > yesLeft - 12 &&
        y < yesTop + yes.height + 12 &&
        y + noBtn.offsetHeight > yesTop - 12;
      if (overlaps) {
        x = x < maxX / 2 ? maxX : pad;
        y = y < maxY / 2 ? maxY : pad;
      }
    }

    setNoPos({ left: x, top: y });
  }

  function dodgeNo(e) {
    e.preventDefault();
    e.stopPropagation();
    if (noDisabled) return;

    burst(e.clientX || 0, e.clientY || 0);

    const nextTries = noTries + 1;
    const nextNoScale = Math.max(0.32, noScale - 0.14);
    const nextYesScale = Math.min(1.6, yesScale + 0.12);

    setNoTries(nextTries);
    setNoScale(nextNoScale);
    setYesScale(nextYesScale);
    moveNoButton();

    if (nextNoScale <= 0.4 || nextTries >= 6) {
      setNoDisabled(true);
    }
  }

  return (
    <>
      <div className="hero-emoji">🥺</div>
      <h1>{CONFIG.askTitle}</h1>
      <p className="sub">{CONFIG.askSub}</p>
      <div className="actions" ref={boxRef}>
        <button
          className={`btn btn-no${noDisabled ? " is-disabled" : ""}`}
          ref={noRef}
          type="button"
          disabled={noDisabled}
          style={{
            left: noPos.left,
            top: noPos.top,
            transform: `scale(${noScale})`,
          }}
          onMouseEnter={dodgeNo}
          onPointerDown={dodgeNo}
          onClick={dodgeNo}
        >
          {noDisabled ? "بیخیال 😅" : noLabel}
        </button>
        <button
          className="btn btn-yes"
          ref={yesRef}
          type="button"
          style={{ transform: `scale(${yesScale})` }}
          onClick={(e) => {
            burst(e.clientX, e.clientY);
            onYes();
          }}
        >
          {CONFIG.yesLabel}
        </button>
      </div>
      <p className="hint">{CONFIG.askHint}</p>
    </>
  );
}
