import { CONFIG } from "../config";

export default function FoodStep({ food, onSelect, onNext, burst, theme }) {
  const heroEmoji = theme?.foodHero || "🍽️";
  const foodTitle = theme?.foodTitle || CONFIG.foodTitle;
  const foodSub = theme?.foodSub || CONFIG.foodSub;
  const foodCategories = theme?.foodCategories || CONFIG.foodCategories;
  const foodNext = theme?.foodNext || CONFIG.foodNext;

  return (
    <section className="step food-step">
      <div className="hero-emoji">{heroEmoji}</div>
      <h1>{foodTitle}</h1>
      <p className="sub">{foodSub}</p>
      <div className="food-list">
        {foodCategories.map((category) => (
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
        {foodNext}
      </button>
    </section>
  );
}
