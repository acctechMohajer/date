import { CONFIG } from "../config";

export default function FoodStep({ food, onSelect, onNext, burst }) {
  return (
    <>
      <div className="hero-emoji">🍽️</div>
      <h1>{CONFIG.foodTitle}</h1>
      <p className="sub">{CONFIG.foodSub}</p>
      <div className="food-grid">
        {CONFIG.foods.map((item) => (
          <button
            key={item.id}
            className={`food${food === item.id ? " selected" : ""}`}
            type="button"
            onClick={(e) => {
              burst(e.clientX, e.clientY);
              onSelect(item.id);
            }}
          >
            <span>{item.emoji}</span>
            {item.name}
          </button>
        ))}
      </div>
      <button
        className="btn btn-primary"
        type="button"
        disabled={!food}
        onClick={(e) => {
          if (!food) return;
          burst(e.clientX, e.clientY);
          onNext();
        }}
      >
        {CONFIG.foodNext}
      </button>
    </>
  );
}
