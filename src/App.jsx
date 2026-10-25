import { useCallback, useEffect, useMemo, useState } from "react";
import { CONFIG } from "./config";
import { getCurrentIranSeason, SEASONS } from "./theme/seasons";
import AskStep from "./components/AskStep";
import ClickFx from "./components/ClickFx";
import ConfirmStep from "./components/ConfirmStep";
import DateStep from "./components/DateStep";
import FoodStep from "./components/FoodStep";
import LetterStep from "./components/LetterStep";
import Progress from "./components/Progress";
import SeasonBar from "./components/SeasonBar";
import Sky from "./components/Sky";

function selectedFood(foodId) {
  return CONFIG.foods.find((item) => item.id === foodId);
}

function App() {
  const iranSeason = useMemo(() => getCurrentIranSeason(), []);
  const [season, setSeason] = useState(iranSeason);
  const activeTheme = SEASONS[season] || SEASONS.autumn;

  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [food, setFood] = useState(null);
  const [bits, setBits] = useState([]);

  // Sync theme attribute, title, and favicon dynamically
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", season);
    document.title = activeTheme.title;

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", activeTheme.themeColor);
    }

    const linkIcon = document.querySelector('link[rel="icon"]');
    if (linkIcon) {
      linkIcon.setAttribute(
        "href",
        `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${activeTheme.icon}</text></svg>`,
      );
    }
  }, [season, activeTheme]);

  const burst = useCallback(
    (x, y) => {
      const emojis = activeTheme.clickEmojis;
      const next = Array.from({ length: 7 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 70;
        return {
          id: `${Date.now()}-${i}-${Math.random()}`,
          x,
          y,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist}px`,
        };
      });

      setBits((prev) => [...prev, ...next]);
      window.setTimeout(() => {
        setBits((prev) => prev.filter((bit) => !next.some((n) => n.id === bit.id)));
      }, 900);
    },
    [activeTheme],
  );

  const goLetterDone = useCallback(() => setStep(4), []);

  function handleStageClick(e) {
    if (
      e.target.closest(
        "button, input, label, select, .rmdp-container, .rmdp-calendar, .rmdp-wrapper, .shamsi-picker",
      )
    ) {
      return;
    }
    burst(e.clientX, e.clientY);
  }

  return (
    <div onClick={handleStageClick}>
      <Sky theme={activeTheme} />
      <ClickFx bits={bits} />
      <main className="stage">
        <SeasonBar
          season={season}
          iranSeason={iranSeason}
          onSelect={setSeason}
          burst={burst}
        />
        <section className={`card${step === 3 ? " is-ceremony" : ""}`}>
          <Progress step={step} />
          <div className="step-body">
            {step === 0 && (
              <AskStep
                onYes={() => setStep(1)}
                burst={burst}
                theme={activeTheme}
              />
            )}
            {step === 1 && (
              <DateStep
                date={date}
                time={time}
                onChange={({ date: nextDate, time: nextTime }) => {
                  setDate(nextDate);
                  setTime(nextTime);
                }}
                onNext={() => setStep(2)}
                burst={burst}
                theme={activeTheme}
              />
            )}
            {step === 2 && (
              <FoodStep
                food={food}
                onSelect={setFood}
                onNext={() => setStep(3)}
                burst={burst}
                theme={activeTheme}
              />
            )}
            {step === 3 && (
              <LetterStep
                date={date}
                time={time}
                food={selectedFood(food)}
                onDone={goLetterDone}
                burst={burst}
                theme={activeTheme}
              />
            )}
            {step === 4 && (
              <ConfirmStep
                date={date}
                time={time}
                food={selectedFood(food)}
                burst={burst}
                theme={activeTheme}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
