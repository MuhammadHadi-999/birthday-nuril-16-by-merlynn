/* ===== KONFIGURASI (satu-satunya tempat mengubah mode & tanggal) ===== */
const CONFIG = {
  mode: "test",                 // "test" = 15 detik, "production" = tanggal asli
  testDurationSeconds: 15,
  birthdayTarget: "2026-11-29T00:00:00+07:00",
  blowClicks: 7
};

/* ===== STATE ===== */
const state = { prayer: "", blows: 0, timerId: null };
const $ = (id) => document.getElementById(id);

/* Target dihitung SEKALI saat load */
const targetTime = CONFIG.mode === "test"
  ? Date.now() + CONFIG.testDurationSeconds * 1000
  : Date.parse(CONFIG.birthdayTarget);
const birthdayReached = () => Date.now() >= targetTime;

/* ===== NAVIGASI ===== */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => {
    const on = s.id === id;
    s.classList.toggle("active", on);
    s.toggleAttribute("inert", !on);
  });
  if (id === "countdown") fall("star", 36);
  if (id === "birthday") fall("confetti", 45);   // ganti dari bintang ke kertas warna-warni
  window.scrollTo(0, 0);
}
document.addEventListener("click", (e) => {
  const next = e.target.closest("[data-next]");
  if (next) show(next.dataset.next);
});

/* ===== COUNTDOWN ===== */
const pad = (n) => String(n).padStart(2, "0");
const enterBtn = $("enter-btn");
function setTimer(left) {
  const s = Math.max(0, Math.floor(left / 1000));
  $("t-d").textContent = pad(Math.floor(s / 86400));
  $("t-h").textContent = pad(Math.floor((s % 86400) / 3600));
  $("t-m").textContent = pad(Math.floor((s % 3600) / 60));
  $("t-s").textContent = pad(s % 60);
}
function unlockEnter() {                       // waktu habis -> tombol Masuk bisa diklik
  clearInterval(state.timerId);
  state.timerId = null;
  setTimer(0);
  enterBtn.disabled = false;
  enterBtn.textContent = "Masuk ✨";
}
function tick() {
  const left = targetTime - Date.now();
  if (left <= 0) return unlockEnter();
  setTimer(left);
}
function startCountdown() {
  show("countdown");
  if (birthdayReached()) return unlockEnter();  // dibuka setelah waktunya: langsung bisa masuk
  tick();
  state.timerId = setInterval(tick, 1000);
}
// Klik "Masuk" = interaksi pengguna, jadi browser mengizinkan musik langsung main
enterBtn.addEventListener("click", () => {
  if (enterBtn.disabled) return;
  show("birthday");
  startMusic();
});

/* ===== EFEK JATUH: bintang (countdown) -> kertas warna-warni (Happy Birthday dst.) ===== */
let fallType = null;
const CONFETTI_COLORS = ["#FF8FA3", "#FFD166", "#8ED1FC", "#9BE7B0", "#C3A6FF", "#FFB36B"];
function fall(type, n) {
  if (fallType === type) return;             // sudah aktif, jangan dobel
  fallType = type;
  const box = $("stars");
  box.replaceChildren();
  for (let i = 0; i < n; i++) {
    const el = document.createElement("span");
    el.className = type;
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDuration = 6 + Math.random() * 8 + "s";
    el.style.animationDelay = -Math.random() * 10 + "s";
    if (type === "star") {
      el.textContent = i % 3 ? "✦" : "★";
      el.style.fontSize = 16 + Math.random() * 22 + "px";
      el.style.color = i % 2 ? "#FFFFFF" : "#F2B705";   // putih & kuning
      el.style.opacity = 0.85 + Math.random() * 0.15;
    } else {
      el.style.width = 7 + Math.random() * 5 + "px";      // kertas panjang vertikal
      el.style.height = 26 + Math.random() * 20 + "px";
      el.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    }
    box.appendChild(el);
  }
}

/* ===== DOA ===== */
const doaInput = $("doa-input");
doaInput.addEventListener("input", () => ($("doa-count").textContent = doaInput.value.length));
$("doa-send").addEventListener("click", () => {
  const text = doaInput.value.trim();
  $("doa-error").hidden = text !== "";
  if (!text) return;
  state.prayer = text;                       // hanya di memori halaman
  $("prayer-out").textContent = text;        // textContent = aman
  show("aamiin");
});

/* ===== LILIN ===== */
const cake = $("cake");
$("blow-btn").addEventListener("click", () => {
  if (state.blows >= CONFIG.blowClicks) return;
  state.blows++;
  cake.dataset.step = Math.min(state.blows, 6);
  if (state.blows >= CONFIG.blowClicks) {
    cake.classList.add("out");
    $("blow-btn").disabled = true;
    $("blow-btn").textContent = "Yeeayyy! 🎉";
    $("candle-done").hidden = false;
    setTimeout(() => ($("candle-next").hidden = false), 1500);
  }
});
function resetCandle() {
  state.blows = 0;
  cake.dataset.step = 0;
  cake.classList.remove("out");
  $("blow-btn").disabled = false;
  $("blow-btn").textContent = "Tiuppp!!! 💨";
  $("candle-done").hidden = true;
  $("candle-next").hidden = true;
}

/* ===== KEMBALI KE AWAL (ke kartu Happy Birthday, bukan countdown) ===== */
$("restart").addEventListener("click", () => {
  state.prayer = "";
  doaInput.value = "";
  $("doa-count").textContent = 0;
  $("doa-error").hidden = true;
  $("prayer-out").textContent = "";
  resetCandle();
  show("birthday");
});

/* ===== MUSIK =====
   Browser memblokir suara otomatis sebelum ada ketukan pengguna.
   Tombol "Masuk" di countdown menjadi pemicunya: klik -> card pertama -> lagu main. */
const bgm = $("bgm"), musicBtn = $("music-btn");
bgm.volume = 0.5;
const syncMusicBtn = () => musicBtn.setAttribute("aria-pressed", String(!bgm.paused));
bgm.addEventListener("play", syncMusicBtn);
bgm.addEventListener("pause", syncMusicBtn);

async function startMusic() {
  try { await bgm.play(); }
  catch (err) {
    // diblokir browser: mulai pada ketukan pertama berikutnya
    document.addEventListener("pointerdown", () => bgm.play().catch(() => {}), { once: true });
  }
}
musicBtn.addEventListener("click", async () => {
  try { if (bgm.paused) await bgm.play(); else bgm.pause(); }
  catch (err) { console.warn("Audio belum tersedia:", err.message); }
});

startCountdown();
