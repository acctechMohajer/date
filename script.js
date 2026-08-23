/* ====== شخصی‌سازی از همین‌جا ====== */
const CONFIG = {
  email: "senator.x.x85@gmail.com",
  askTitle: "با من میای سر قرار نرگس خانم ؟",
  askSub: "نه نداریم ها. امتحان کن 😏",
  noLabel: "نه نداریم ها",
  yesLabel: "آره 💙",
  askHint: "امتحان کن... ولی این دکمه فراره ☁️",
  dateTitle: "کی وقتت آزاده قشنگ؟",
  dateSub: "یه تاریخ و ساعت بده که بدونم کی ببینم دختر قشنگمو 👀",
  dateNext: "خب اینم شد ⭐",
  foodTitle: "شکم کوچولوت چی می‌خواد؟",
  foodSub: "مهمون منی، راحت انتخاب کن 😋",
  foodNext: "بریم که بریم 💌",
  confirmTitle: "دیدی آخرش گفتی آره 😌",
  confirmFooter:
    "این وبسایتو برای نرگس جونم درست کردم (آقایی‌ات برنامه نویسه ها😎) 🙈",
  pickupText: "پس آماده باش، خودم میام دنبالت 🚗💨",
  letterKicker: "یه نامه مخصوص خودت",
  letterCaptionWrite: "قلم رفت روی کاغذ کاهی...",
  letterCaptionFold: "داره نامه تا میشه...",
  letterCaptionInsert: "رفته تو پاکت...",
  letterCaptionClose: "در پاکت داره بسته میشه...",
  letterCaptionWax: "موم داغ... یه کم صبر کن",
  letterCaptionDone: "مهر و موم شد 💌",
  letterGreeting: "نرگس خانم،",
  letterSign: "با مهر، محمدحسین",
  skipLetter: "بپر جلو ✨",
  foods: [
    { id: "pizza", name: "پیتزا", emoji: "🍕" },
    { id: "coffee", name: "قهوه", emoji: "☕" },
    { id: "kubideh", name: "کوبیده", emoji: "🥙" },
    { id: "pasta", name: "پاستا", emoji: "🍝" },
    { id: "nachos", name: "ناچوز", emoji: "🧀" },
    { id: "eskimo", name: "اسکیمو", emoji: "🍦" },
    { id: "croissant", name: "کروسان بستنی", emoji: "🥐" },
  ],
};

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const WEEKDAYS = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];
const CLICK_EMOJIS = ["☁️", "🌤️", "💙", "🩵", "✨", "🕊️", "💎", "🌊"];
const NO_TEASES = [
  "نه نداریم ها",
  "امتحان کن 😌",
  "نرسیدی؟",
  "باز فرار کردم",
  "آره رو بزن دیگه",
];

const state = {
  step: 0,
  date: "",
  time: "",
  food: null,
  noScale: 1,
  yesScale: 1,
  noTries: 0,
  sending: false,
};

let ceremonyOn = false;
const ceremonyTimers = [];

const bodyEl = document.getElementById("step-body");
const progressEl = document.getElementById("progress");
const cardEl = document.getElementById("app");

function gregorianToJalali(gy, gm, gd) {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    gdm[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

function formatDateTime(dateValue, timeValue) {
  const [y, m, d] = dateValue.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const [jy, jm, jd] = gregorianToJalali(y, m, d);
  const weekday = WEEKDAYS[dt.getDay()];
  const [hh, mm] = timeValue.split(":");
  return `${weekday} ${jd} ${MONTHS[jm - 1]} ساعت ${hh}:${mm}`;
}

function renderProgress() {
  const visual = state.step >= 3 ? 3 : state.step;
  progressEl.innerHTML = [0, 1, 2, 3]
    .map((i) => `<span class="dot ${i === visual ? "active" : ""}"></span>`)
    .join("");
}

function spawnSky() {
  const sky = document.getElementById("sky");
  for (let i = 0; i < 7; i++) {
    const cloud = document.createElement("div");
    cloud.className = "cloud";
    const w = 90 + Math.random() * 140;
    cloud.style.width = w + "px";
    cloud.style.height = w * 0.38 + "px";
    cloud.style.top = 6 + Math.random() * 78 + "%";
    cloud.style.left = "-25%";
    cloud.style.opacity = 0.35 + Math.random() * 0.4;
    cloud.style.animationDuration = 22 + Math.random() * 28 + "s";
    cloud.style.animationDelay = -Math.random() * 30 + "s";
    sky.appendChild(cloud);
  }
  const emojis = ["☁️", "🌤️", "💙", "🩵", "✨", "🕊️"];
  for (let i = 0; i < 14; i++) {
    const el = document.createElement("div");
    el.className = "sky-emoji";
    el.textContent = emojis[i % emojis.length];
    el.style.left = Math.random() * 92 + "%";
    el.style.top = Math.random() * 88 + "%";
    el.style.fontSize = 16 + Math.random() * 18 + "px";
    el.style.animationDuration = 4 + Math.random() * 5 + "s";
    el.style.animationDelay = -Math.random() * 4 + "s";
    sky.appendChild(el);
  }
}

function burst(x, y) {
  const layer = document.getElementById("click-fx");
  for (let i = 0; i < 7; i++) {
    const bit = document.createElement("span");
    bit.className = "click-bit";
    bit.textContent =
      CLICK_EMOJIS[Math.floor(Math.random() * CLICK_EMOJIS.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 70;
    bit.style.left = x + "px";
    bit.style.top = y + "px";
    bit.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    bit.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    layer.appendChild(bit);
    setTimeout(() => bit.remove(), 900);
  }
}

function defaultDate() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().slice(0, 10);
}

function moveNoButton(noBtn, box) {
  const pad = 8;
  const maxX = Math.max(pad, box.clientWidth - noBtn.offsetWidth - pad);
  const maxY = Math.max(pad, box.clientHeight - noBtn.offsetHeight - pad);
  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  const yesBtn = document.getElementById("yes-btn");
  if (yesBtn) {
    const yes = yesBtn.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();
    const yesLeft = yes.left - boxRect.left;
    const yesTop = yes.top - boxRect.top;
    const overlaps =
      x < yesLeft + yes.width + 12 &&
      x + noBtn.offsetWidth > yesLeft - 12 &&
      y < yesTop + yes.height + 12 &&
      y + noBtn.offsetHeight > yesTop - 12;
    if (overlaps) {
      x = x < maxX / 2 ? maxX : pad;
      y = y < maxY / 2 ? maxY : pad;
    }
  }

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

function teaseNo(noBtn) {
  noBtn.textContent = NO_TEASES[Math.min(state.noTries, NO_TEASES.length - 1)];
}

function dodgeNo(e, noBtn, yesBtn, box) {
  e.preventDefault();
  e.stopPropagation();
  burst(e.clientX || 0, e.clientY || 0);

  state.noTries += 1;
  state.noScale = Math.max(0.32, state.noScale - 0.14);
  state.yesScale = Math.min(1.6, state.yesScale + 0.12);

  noBtn.style.transform = `scale(${state.noScale})`;
  yesBtn.style.transform = `scale(${state.yesScale})`;
  teaseNo(noBtn);
  moveNoButton(noBtn, box);

  if (state.noScale <= 0.4 || state.noTries >= 6) {
    noBtn.disabled = true;
    noBtn.classList.add("is-disabled");
    noBtn.textContent = "بیخیال 😅";
  }
}

function later(ms) {
  return new Promise((resolve) => {
    const id = setTimeout(resolve, ms);
    ceremonyTimers.push(id);
  });
}

function stopCeremony() {
  ceremonyOn = false;
  while (ceremonyTimers.length) clearTimeout(ceremonyTimers.pop());
}

function finishCeremony() {
  stopCeremony();
  state.step = 4;
  render();
}

function letterLines() {
  const food = selectedFood();
  const when = formatDateTime(state.date, state.time);
  return [
    CONFIG.letterGreeting,
    `پس ${when}`,
    `میام دنبالت، برای ${food.name} ${food.emoji}`,
    "خودم میام دنبالت.",
    CONFIG.letterSign,
  ];
}

function typeLine(el, text, quill) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = "";
    const tick = () => {
      if (!ceremonyOn) return resolve();
      i += 1;
      el.textContent = text.slice(0, i);
      if (quill) {
        const lineTop = el.offsetTop + 6;
        quill.style.top = lineTop + "px";
      }
      if (i < text.length) {
        const pause = /[،.!؟]/.test(text[i - 1]) ? 90 : 34;
        const id = setTimeout(tick, pause);
        ceremonyTimers.push(id);
      } else {
        resolve();
      }
    };
    tick();
  });
}

function renderAsk() {
  bodyEl.innerHTML = `
    <div class="hero-emoji">🥺</div>
    <h1>${CONFIG.askTitle}</h1>
    <p class="sub">${CONFIG.askSub}</p>
    <div class="actions" id="ask-actions">
      <button class="btn btn-no" id="no-btn" type="button">${CONFIG.noLabel}</button>
      <button class="btn btn-yes" id="yes-btn" type="button">${CONFIG.yesLabel}</button>
    </div>
    <p class="hint">${CONFIG.askHint}</p>
  `;

  const box = document.getElementById("ask-actions");
  const noBtn = document.getElementById("no-btn");
  const yesBtn = document.getElementById("yes-btn");

  requestAnimationFrame(() => {
    noBtn.style.left = "18px";
    noBtn.style.top = box.clientHeight / 2 - noBtn.offsetHeight / 2 + "px";
  });

  const runAway = (e) => dodgeNo(e, noBtn, yesBtn, box);
  noBtn.addEventListener("mouseenter", runAway);
  noBtn.addEventListener("pointerdown", runAway);
  noBtn.addEventListener("click", runAway);

  yesBtn.addEventListener("click", (e) => {
    burst(e.clientX, e.clientY);
    state.step = 1;
    render();
  });
}

function renderDate() {
  const dateVal = state.date || defaultDate();
  const timeVal = state.time || "16:21";
  bodyEl.innerHTML = `
    <div class="hero-emoji">📅</div>
    <h1>${CONFIG.dateTitle}</h1>
    <p class="sub">${CONFIG.dateSub}</p>
    <div class="fields">
      <label>تاریخ
        <input type="date" id="date-input" value="${dateVal}" />
      </label>
      <label>ساعت
        <input type="time" id="time-input" value="${timeVal}" />
      </label>
    </div>
    <button class="btn btn-primary" id="next-date" type="button">${CONFIG.dateNext}</button>
  `;
  document.getElementById("next-date").addEventListener("click", (e) => {
    burst(e.clientX, e.clientY);
    state.date = document.getElementById("date-input").value;
    state.time = document.getElementById("time-input").value;
    if (!state.date || !state.time) return;
    state.step = 2;
    render();
  });
}

function renderFood() {
  bodyEl.innerHTML = `
    <div class="hero-emoji">🍽️</div>
    <h1>${CONFIG.foodTitle}</h1>
    <p class="sub">${CONFIG.foodSub}</p>
    <div class="food-grid">
      ${CONFIG.foods
        .map(
          (f) => `
        <button class="food ${state.food === f.id ? "selected" : ""}" data-id="${f.id}" type="button">
          <span>${f.emoji}</span>${f.name}
        </button>
      `,
        )
        .join("")}
    </div>
    <button class="btn btn-primary" id="next-food" type="button" ${state.food ? "" : "disabled"}>
      ${CONFIG.foodNext}
    </button>
  `;

  bodyEl.querySelectorAll(".food").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      burst(e.clientX, e.clientY);
      state.food = btn.dataset.id;
      renderFood();
    });
  });

  document.getElementById("next-food").addEventListener("click", (e) => {
    if (!state.food) return;
    burst(e.clientX, e.clientY);
    state.step = 3;
    render();
  });
}

function selectedFood() {
  return CONFIG.foods.find((f) => f.id === state.food);
}

function renderLetter() {
  const lines = letterLines();
  bodyEl.innerHTML = `
    <p class="ceremony-kicker">${CONFIG.letterKicker}</p>
    <div class="desk" id="desk">
      <div class="paper" id="paper">
        ${lines.map((_, i) => `<p class="paper-line ${i === lines.length - 1 ? "sign" : ""}" id="line-${i}"></p>`).join("")}
        <div class="quill" id="quill">🪶</div>
      </div>
      <div class="envelope" id="envelope">
        <div class="env-back"></div>
        <div class="env-flap"></div>
        <div class="env-front"></div>
        <div class="wax-drop"></div>
        <div class="wax-seal"><span>♥</span></div>
      </div>
    </div>
    <p class="ceremony-caption" id="ceremony-caption">${CONFIG.letterCaptionWrite}</p>
    <button class="btn btn-ghost" id="skip-ceremony" type="button">${CONFIG.skipLetter}</button>
  `;

  document.getElementById("skip-ceremony").addEventListener("click", (e) => {
    burst(e.clientX, e.clientY);
    finishCeremony();
  });

  playLetter(lines);
}

async function playLetter(lines) {
  stopCeremony();
  ceremonyOn = true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    finishCeremony();
    return;
  }

  const paper = document.getElementById("paper");
  const envelope = document.getElementById("envelope");
  const quill = document.getElementById("quill");
  const caption = document.getElementById("ceremony-caption");
  if (!paper || !envelope) return;

  const say = (text) => {
    if (caption) caption.textContent = text;
  };

  await later(80);
  if (!ceremonyOn) return;
  paper.classList.add("is-in");
  envelope.classList.add("is-ready");
  quill.classList.add("is-on");
  say(CONFIG.letterCaptionWrite);

  for (let i = 0; i < lines.length; i += 1) {
    if (!ceremonyOn) return;
    const el = document.getElementById(`line-${i}`);
    await typeLine(el, lines[i], quill);
    await later(160);
  }

  if (!ceremonyOn) return;
  quill.classList.remove("is-on");
  await later(520);

  if (!ceremonyOn) return;
  say(CONFIG.letterCaptionFold);
  paper.classList.add("is-folding");
  await later(780);

  if (!ceremonyOn) return;
  say(CONFIG.letterCaptionInsert);
  envelope.classList.add("is-focus");
  paper.classList.remove("is-folding");
  paper.classList.add("is-inserting");
  await later(980);

  if (!ceremonyOn) return;
  say(CONFIG.letterCaptionClose);
  paper.classList.add("is-hidden");
  envelope.classList.add("is-closed");
  await later(860);

  if (!ceremonyOn) return;
  say(CONFIG.letterCaptionWax);
  envelope.classList.add("is-dripping");
  await later(540);

  if (!ceremonyOn) return;
  envelope.classList.add("is-sealed");
  say(CONFIG.letterCaptionDone);
  await later(1450);

  if (!ceremonyOn) return;
  finishCeremony();
}

function renderConfirm() {
  const food = selectedFood();
  const when = formatDateTime(state.date, state.time);
  bodyEl.innerHTML = `
    <div class="mini-envelope" aria-hidden="true"><i></i><em></em><b></b></div>
    <h1>${CONFIG.confirmTitle}</h1>
    <div class="result">
      پس ${when} میام دنبالت، برای ${food.name} ${food.emoji} 🥂
    </div>
    <p class="sub">${CONFIG.pickupText}</p>
    <button class="btn btn-primary" id="send-again" type="button">ارسال ☁️</button>
    <p class="status" id="mail-status">بزن روی ارسال تا محمدحسین باخبر شه 😉</p>
    <p class="note">${CONFIG.confirmFooter}</p>
  `;
  document.getElementById("send-again").addEventListener("click", (e) => {
    burst(e.clientX, e.clientY);
    sendEmail();
  });
}

function mailBody() {
  const food = selectedFood();
  return [
    "یک پاسخ جدید برای دعوت ثبت شد.",
    `تاریخ و ساعت: ${formatDateTime(state.date, state.time)}`,
    `سفارش: ${food.emoji} ${food.name}`,
    `تاریخ میلادی: ${state.date}`,
    `ساعت: ${state.time}`,
  ].join("\n");
}

async function sendEmail(forceMailto = false) {
  const status = document.getElementById("mail-status");
  const food = selectedFood();
  if (!food || state.sending) return;
  state.sending = true;
  if (status) status.textContent = "داره جزئیات دیت برات ایمیل میشه...";

  const payload = {
    _subject: `پاسخ دعوت: ${food.name} | ${state.date} ${state.time}`,
    date: state.date,
    time: state.time,
    jalali: formatDateTime(state.date, state.time),
    order: `${food.emoji} ${food.name}`,
    message: mailBody(),
  };

  try {
    if (!forceMailto) {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (status) status.textContent = "جزئیات دیت ایمیل شد 💌";
        state.sending = false;
        return;
      }
    }
    throw new Error("fallback");
  } catch {
    const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(mailBody())}`;
    window.location.href = mailto;
    if (status)
      status.textContent =
        "اگر فرم‌سرویس فعال نبود، برنامه ایمیل باز شد تا همان جزئیات را بفرستی.";
  } finally {
    state.sending = false;
  }
}

function render() {
  stopCeremony();
  cardEl.classList.toggle("is-ceremony", state.step === 3);
  renderProgress();
  if (state.step === 0) renderAsk();
  else if (state.step === 1) renderDate();
  else if (state.step === 2) renderFood();
  else if (state.step === 3) renderLetter();
  else renderConfirm();
}

document.addEventListener("click", (e) => {
  if (e.target.closest("button, input, label, select")) return;
  burst(e.clientX, e.clientY);
});

spawnSky();
render();
