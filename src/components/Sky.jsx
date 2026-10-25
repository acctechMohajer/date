import { useMemo } from "react";

const CLOUD_SLOTS = Array.from({ length: 7 }, (_, i) => {
  const w = 90 + ((i * 23) % 140);
  return {
    id: `cloud-${i}`,
    width: w,
    height: w * 0.38,
    top: `${6 + ((i * 13) % 76)}%`,
    opacity: 0.22 + ((i * 0.05) % 0.25),
    duration: `${22 + ((i * 4) % 26)}s`,
    delay: `${-((i * 5) % 28)}s`,
  };
});

const EMOJI_SLOTS = Array.from({ length: 14 }, (_, i) => ({
  id: `emoji-${i}`,
  left: `${6 + ((i * 7 + 13) % 86)}%`,
  top: `${8 + ((i * 11 + 7) % 80)}%`,
  fontSize: `${16 + ((i * 5) % 18)}px`,
  duration: `${4.5 + ((i * 1.3) % 4.5)}s`,
  delay: `${-((i * 1.7) % 4)}s`,
}));

const FALLING_SLOTS = Array.from({ length: 9 }, (_, i) => ({
  id: `leaf-${i}`,
  left: `${3 + i * 11 + (((i * 4) % 6) - 3)}%`,
  fontSize: `${18 + ((i * 3) % 14)}px`,
  duration: `${8 + ((i * 2.1) % 7)}s`,
  delay: `${-((i * 1.9) % 8)}s`,
}));

export default function Sky({ theme }) {
  const emojis = useMemo(() => {
    const list = theme?.skyEmojis || ["🍂", "🍁", "🧡", "✨"];
    return EMOJI_SLOTS.map((slot, i) => ({
      ...slot,
      text: list[i % list.length],
    }));
  }, [theme]);

  const fallingLeaves = useMemo(() => {
    const list = theme?.fallingElements || ["🍁", "🍂"];
    return FALLING_SLOTS.map((slot, i) => ({
      ...slot,
      text: list[i % list.length],
    }));
  }, [theme]);

  return (
    <div id="sky" aria-hidden="true">
      {CLOUD_SLOTS.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud"
          style={{
            width: cloud.width,
            height: cloud.height,
            top: cloud.top,
            left: "-25%",
            opacity: cloud.opacity,
            animationDuration: cloud.duration,
            animationDelay: cloud.delay,
          }}
        />
      ))}
      {fallingLeaves.map((leaf) => (
        <div
          key={leaf.id}
          className="falling-leaf"
          style={{
            left: leaf.left,
            fontSize: leaf.fontSize,
            animationDuration: leaf.duration,
            animationDelay: leaf.delay,
          }}
        >
          {leaf.text}
        </div>
      ))}
      {emojis.map((item) => (
        <div
          key={item.id}
          className="sky-emoji"
          style={{
            left: item.left,
            top: item.top,
            fontSize: item.fontSize,
            animationDuration: item.duration,
            animationDelay: item.delay,
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
