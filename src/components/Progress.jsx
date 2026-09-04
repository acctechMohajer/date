export default function Progress({ step }) {
  const visual = step >= 3 ? 3 : step;

  return (
    <div className="progress">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`dot${i === visual ? " active" : ""}`}
        />
      ))}
    </div>
  );
}
