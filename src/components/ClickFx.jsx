export default function ClickFx({ bits }) {
  return (
    <div id="click-fx" aria-hidden="true">
      {bits.map((bit) => (
        <span
          key={bit.id}
          className="click-bit"
          style={{
            left: bit.x,
            top: bit.y,
            "--dx": bit.dx,
            "--dy": bit.dy,
          }}
        >
          {bit.emoji}
        </span>
      ))}
    </div>
  );
}
