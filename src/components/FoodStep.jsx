import { CONFIG } from "../config";

export default function FoodStep({ food, onSelect, onNext, burst }) {
  return (
    <section className="step food-step">
      <div className="hero-emoji">🍽️</div>
      <h1>{CONFIG.foodTitle}</h1>
      <p className="sub">{CONFIG.foodSub}</p>
      <div className="food-list">
        {CONFIG.foodCategories.map((category) => (
          <div key={category.id} className="food-category">
            <h2 className="food-category-title">{category.title}</h2>
            <div className="food-grid">
              {CONFIG.foods
                .filter((item) => item.category === category.id)
                .map((item) => (
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
          </div>
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
    </section>
  );
}
