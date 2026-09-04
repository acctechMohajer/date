import { useMemo } from "react";

const EMOJIS = ["☁️", "🌤️", "💙", "🩵", "✨", "🕊️"];

function makeClouds() {
  return Array.from({ length: 7 }, (_, i) => {
    const w = 90 + Math.random() * 140;
    return {
      id: `cloud-${i}`,
      width: w,
      height: w * 0.38,
      top: `${6 + Math.random() * 78}%`,
      opacity: 0.35 + Math.random() * 0.4,
      duration: `${22 + Math.random() * 28}s`,
      delay: `${-Math.random() * 30}s`,
    };
  });
}

function makeEmojis() {
  return Array.from({ length: 14 }, (_, i) => ({
    id: `emoji-${i}`,
    text: EMOJIS[i % EMOJIS.length],
    left: `${Math.random() * 92}%`,
    top: `${Math.random() * 88}%`,
    fontSize: `${16 + Math.random() * 18}px`,
    duration: `${4 + Math.random() * 5}s`,
    delay: `${-Math.random() * 4}s`,
  }));
}

export default function Sky() {
  const clouds = useMemo(() => makeClouds(), []);
  const emojis = useMemo(() => makeEmojis(), []);

  return (
    <div id="sky" aria-hidden="true">
      {clouds.map((cloud) => (
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
