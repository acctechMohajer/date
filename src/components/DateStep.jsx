import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import { CONFIG } from "../config";
import {
  dateObjectFromISO,
  defaultDate,
  isoFromDateObject,
  persian,
  persian_fa,
} from "../lib/jalali";

export default function DateStep({ date, time, onChange, onNext, burst }) {
  const [dateVal, setDateVal] = useState(date || defaultDate());
  const [timeVal, setTimeVal] = useState(time || "16:21");
  const [pickerValue, setPickerValue] = useState(() =>
    dateObjectFromISO(date || defaultDate()),
  );

  function handleDateChange(next) {
    setPickerValue(next);
    setDateVal(isoFromDateObject(next));
  }

  return (
    <>
      <div className="hero-emoji">📅</div>
      <h1>{CONFIG.dateTitle}</h1>
      <p className="sub">{CONFIG.dateSub}</p>
      <div className="fields">
        <label>
          تاریخ شمسی
          <DatePicker.default
            value={pickerValue}
            onChange={handleDateChange}
            calendar={persian}
            locale={persian_fa}
            format="D MMMM YYYY"
            calendarPosition="bottom-center"
            containerClassName="shamsi-picker"
            inputClass="shamsi-input"
            placeholder="تاریخ را انتخاب کن"
            editable={false}
            portal
            zIndex={200}
            hideOnScroll
            highlightToday
          />
        </label>
        <label>
          ساعت
          <div className="time-picker" dir="ltr">
            <select
              aria-label="ساعت"
              value={timeVal.split(":")[0]}
              onChange={(e) =>
                setTimeVal(`${e.target.value}:${timeVal.split(":")[1] || "00"}`)
              }
            >
              {Array.from({ length: 24 }, (_, hour) => (
                <option key={hour} value={String(hour).padStart(2, "0")}>
                  {String(hour).padStart(2, "0")}
                </option>
              ))}
            </select>
            <span>:</span>
            <select
              aria-label="دقیقه"
              value={timeVal.split(":")[1] || "00"}
              onChange={(e) =>
                setTimeVal(`${timeVal.split(":")[0] || "00"}:${e.target.value}`)
              }
            >
              {Array.from({ length: 60 }, (_, minute) => (
                <option key={minute} value={String(minute).padStart(2, "0")}>
                  {String(minute).padStart(2, "0")}
                </option>
              ))}
            </select>
          </div>
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
