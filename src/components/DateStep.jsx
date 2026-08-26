import { useState } from "react";
import { CONFIG } from "../config";
import { defaultDate } from "../lib/jalali";

export default function DateStep({ date, time, onChange, onNext, burst }) {
  const [dateVal, setDateVal] = useState(date || defaultDate());
  const [timeVal, setTimeVal] = useState(time || "16:21");

  return (
    <>
      <div className="hero-emoji">📅</div>
      <h1>{CONFIG.dateTitle}</h1>
      <p className="sub">{CONFIG.dateSub}</p>
      <div className="fields">
        <label>
          تاریخ
          <input
            type="date"
            value={dateVal}
            onChange={(e) => setDateVal(e.target.value)}
          />
        </label>
        <label>
          ساعت
          <input
            type="time"
            value={timeVal}
            onChange={(e) => setTimeVal(e.target.value)}
          />
        </label>
      </div>
      <button
        className="btn btn-primary"
        type="button"
        onClick={(e) => {
          burst(e.clientX, e.clientY);
          if (!dateVal || !timeVal) return;
          onChange({ date: dateVal, time: timeVal });
          onNext();
        }}
      >
        {CONFIG.dateNext}
      </button>
    </>
  );
}
