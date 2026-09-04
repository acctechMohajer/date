import { useCallback, useState } from "react";
import { CLICK_EMOJIS, CONFIG } from "./config";
import AskStep from "./components/AskStep";
import ClickFx from "./components/ClickFx";
import ConfirmStep from "./components/ConfirmStep";
import DateStep from "./components/DateStep";
import FoodStep from "./components/FoodStep";
import LetterStep from "./components/LetterStep";
import Progress from "./components/Progress";
import Sky from "./components/Sky";

function selectedFood(foodId) {
  return CONFIG.foods.find((item) => item.id === foodId);
}

function App() {
  const [step, setStep] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [food, setFood] = useState(null);
  const [bits, setBits] = useState([]);

  const burst = useCallback((x, y) => {
    const next = Array.from({ length: 7 }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 40 + Math.random() * 70;
      return {
        id: `${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        emoji: CLICK_EMOJIS[Math.floor(Math.random() * CLICK_EMOJIS.length)],
        dx: `${Math.cos(angle) * dist}px`,
        dy: `${Math.sin(angle) * dist}px`,
      };
    });

    setBits((prev) => [...prev, ...next]);
    window.setTimeout(() => {
      setBits((prev) => prev.filter((bit) => !next.some((n) => n.id === bit.id)));
    }, 900);
  }, []);

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
      <Sky />
      <ClickFx bits={bits} />
      <main className="stage">
        <section className={`card${step === 3 ? " is-ceremony" : ""}`}>
          <Progress step={step} />
          <div className="step-body">
            {step === 0 && <AskStep onYes={() => setStep(1)} burst={burst} />}
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
              />
            )}
            {step === 2 && (
              <FoodStep
                food={food}
                onSelect={setFood}
                onNext={() => setStep(3)}
                burst={burst}
              />
            )}
            {step === 3 && (
              <LetterStep
                date={date}
                time={time}
                food={selectedFood(food)}
                onDone={goLetterDone}
                burst={burst}
              />
            )}
            {step === 4 && (
              <ConfirmStep
                date={date}
                time={time}
                food={selectedFood(food)}
                burst={burst}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
