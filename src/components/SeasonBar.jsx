import { SEASONS } from "../theme/seasons";

export default function SeasonBar({ season, iranSeason, onSelect, burst }) {
  // این نوار فقط در حالت dev نمایش داده می‌شود و در بیلد پروداکشن (release) کاملاً مخفی است
  const isDev =
    import.meta.env.DEV ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("dev"));

  if (!isDev) {
    return null;
  }

  return (
    <nav className="season-bar-wrap" aria-label="انتخاب فصل">
      <div className="season-bar">
        {Object.values(SEASONS).map((s) => {
          const isCurrentIran = s.id === iranSeason;
          const isSelected = s.id === season;
          return (
            <button
              key={s.id}
              type="button"
              className={`season-pill${isSelected ? " is-active" : ""}`}
              onClick={(e) => {
                burst(e.clientX, e.clientY);
                onSelect(s.id);
              }}
              title={
                isCurrentIran
                  ? `${s.name} (فصل کنونی در ایران)`
                  : `تغییر تم به ${s.name}`
              }
            >
              <span className="season-pill-icon">{s.icon}</span>
              <span className="season-pill-text">{s.name}</span>
              {isCurrentIran && (
                <span className="season-pill-badge" title="فصل کنونی در تقویم ایران">
                  ایران
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
