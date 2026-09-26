import {
  WORLD,
  SYNC_HOLD_MS,
  PLAYER_DEFINITIONS,
  PLATE_DEFINITIONS,
  EXTRACTION_ZONE,
  createInitialRunState,
  computePlateOccupancy,
  countExtractedPlayers,
  updateObjectiveState,
  formatElapsed,
} from "./runtimeModel.js";

const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const shell = document.querySelector(".signal-shell");
const entryOverlay = document.querySelector("#entryOverlay");
const rulesOverlay = document.querySelector("#rulesOverlay");
const resultOverlay = document.querySelector("#resultOverlay");
const missionText = document.querySelector("#missionText");
const syncFill = document.querySelector("#syncFill");
const syncText = document.querySelector("#syncText");
const timerText = document.querySelector("#timerText");
const hitText = document.querySelector("#hitText");
const modePill = document.querySelector("#modePill");
const phaseBanner = document.querySelector("#phaseBanner");
const playerChips = [...document.querySelectorAll("[data-player-select]")];

const obstacles = [
  { x: 345, y: 235, width: 118, height: 118 },
  { x: 817, y: 235, width: 118, height: 118 },
  { x: 345, y: 420, width: 118, height: 118 },
  { x: 817, y: 420, width: 118, height: 118 },
  { x: 585, y: 290, width: 110, height: 55 },
];

const keyState = new Set();
const touchState = new Set();
const particles = [];
let players = [];
let runState = createInitialRunState(0);
let mode = "solo";
let activePlayerIndex = 0;
let running = false;
let paused = false;
let lastTime = performance.now();
let elapsedNow = 0;
let bannerTimeout = 0;
let shake = 0;
let audioEnabled = true;
let audioContext = null;
let lastPlateCount = 0;
let lastPhase = "sync";

const LOCAL_KEYS = [
  { up: "KeyW", left: "KeyA", down: "KeyS", right: "KeyD" },
  { up: "ArrowUp", left: "ArrowLeft", down: "ArrowDown", right: "ArrowRight" },
  { up: "KeyI", left: "KeyJ", down: "KeyK", right: "KeyL" },
  { up: "KeyT", left: "KeyF", down: "KeyG", right: "KeyH" },
];

function createPlayers() {
  return PLAYER_DEFINITIONS.map((def) => ({
    ...def,
    x: def.spawn.x,
    y: def.spawn.y,
    radius: 22,
    vx: 0,
    vy: 0,
    trail: [],
    hitCooldown: 0,
  }));
}

function resetRun({ keepMode = true } = {}) {
  players = createPlayers();
  const now = performance.now();
  runState = createInitialRunState(now);
  elapsedNow = now;
  lastTime = now;
  particles.length = 0;
  keyState.clear();
  touchState.clear();
  lastPlateCount = 0;
  lastPhase = "sync";
  shake = 0;
  if (!keepMode) activePlayerIndex = 0;
  updateHud();
}

function begin(selectedMode) {
  mode = selectedMode;
  shell.dataset.mode = mode;
  modePill.textContent = mode === "solo" ? "SOLO TEST" : "4P LOCAL";
  playerChips.forEach((chip) => {
    chip.disabled = mode !== "solo";
    chip.classList.toggle("is-active", Number(chip.dataset.playerSelect) === activePlayerIndex);
  });
  resetRun();
  running = true;
  paused = false;
  hideOverlay(entryOverlay);
  hideOverlay(resultOverlay);
  showBanner(mode === "solo" ? "SOLO TEST — 1~4로 플레이어 전환" : "4P LOCAL — COORDINATE NOW");
  beep(520, .07, .04);
}

function showOverlay(element) {
  element.hidden = false;
  requestAnimationFrame(() => element.classList.add("is-visible"));
}

function hideOverlay(element) {
  element.classList.remove("is-visible");
  setTimeout(() => {
    if (!element.classList.contains("is-visible")) element.hidden = true;
  }, 210);
}

function endSession() {
  running = false;
  paused = false;
  resetRun({ keepMode: false });
  entryOverlay.hidden = false;
  requestAnimationFrame(() => entryOverlay.classList.add("is-visible"));
}

function openRules() {
  paused = running;
  showOverlay(rulesOverlay);
}

function closeRules() {
  hideOverlay(rulesOverlay);
  paused = false;
  lastTime = performance.now();
}

function selectPlayer(index) {
  if (mode !== "solo") return;
  activePlayerIndex = Math.max(0, Math.min(players.length - 1, index));
  playerChips.forEach((chip) => chip.classList.toggle("is-active", Number(chip.dataset.playerSelect) === activePlayerIndex));
  beep(300 + activePlayerIndex * 70, .04, .018);
}

function inputVector(index) {
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  if (mode === "solo") {
    if (index !== activePlayerIndex) return { x: 0, y: 0 };
    up = keyState.has("KeyW") || keyState.has("ArrowUp") || touchState.has("up");
    down = keyState.has("KeyS") || keyState.has("ArrowDown") || touchState.has("down");
    left = keyState.has("KeyA") || keyState.has("ArrowLeft") || touchState.has("left");
    right = keyState.has("KeyD") || keyState.has("ArrowRight") || touchState.has("right");
  } else {
    const map = LOCAL_KEYS[index];
    up = keyState.has(map.up);
    down = keyState.has(map.down);
    left = keyState.has(map.left);
    right = keyState.has(map.right);
  }
  let x = (right ? 1 : 0) - (left ? 1 : 0);
  let y = (down ? 1 : 0) - (up ? 1 : 0);
  const length = Math.hypot(x, y) || 1;
  if (x || y) {
    x /= length;
    y /= length;
  }
  return { x, y };
}

function circleHitsRect(x, y, radius, rect) {
  const closestX = Math.max(rect.x, Math.min(x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(y, rect.y + rect.height));
  const dx = x - closestX;
  const dy = y - closestY;
  return dx * dx + dy * dy < radius * radius;
}

function collidesAt(player, x, y) {
  const margin = player.radius + 22;
  if (x < margin || x > WORLD.width - margin || y < margin || y > WORLD.height - margin) return true;
  return obstacles.some((rect) => circleHitsRect(x, y, player.radius, rect));
}

function movePlayer(player, dx, dy) {
  if (!collidesAt(player, player.x + dx, player.y)) player.x += dx;
  else player.vx *= -.08;
  if (!collidesAt(player, player.x, player.y + dy)) player.y += dy;
  else player.vy *= -.08;
}

function hazardRects(timeMs) {
  const t = timeMs / 1000;
  const horizontalY = 365 + Math.sin(t * 1.05) * 118;
  const verticalX = 640 + Math.sin(t * .82 + 1.6) * 188;
  return [
    { x: 250, y: horizontalY - 5, width: 780, height: 10, axis: "h", alpha: .75 },
    { x: verticalX - 5, y: 188, width: 10, height: 372, axis: "v", alpha: .58 },
  ];
}

function spawnBurst(x, y, color, amount = 12, speed = 130) {
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = speed * (.35 + Math.random() * .65);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      life: .35 + Math.random() * .45,
      maxLife: .8,
      size: 1.5 + Math.random() * 3,
      color,
    });
  }
}

function hitPlayer(player) {
  if (player.hitCooldown > 0 || runState.phase === "cleared") return;
  spawnBurst(player.x, player.y, player.color, 20, 220);
  player.x = player.spawn.x;
  player.y = player.spawn.y;
  player.vx = 0;
  player.vy = 0;
  player.hitCooldown = .9;
  runState = { ...runState, hazardHits: runState.hazardHits + 1 };
  shake = Math.max(shake, 7);
  beep(110, .09, .065, "sawtooth");
}

function update(dt, now) {
  if (!running || paused || runState.phase === "cleared") return;
  elapsedNow = now;
  const speed = 248;
  const acceleration = 12;
  const drag = Math.pow(.0009, dt);

  players.forEach((player, index) => {
    const input = inputVector(index);
    player.vx += (input.x * speed - player.vx) * Math.min(1, acceleration * dt);
    player.vy += (input.y * speed - player.vy) * Math.min(1, acceleration * dt);
    if (!input.x) player.vx *= drag;
    if (!input.y) player.vy *= drag;
    movePlayer(player, player.vx * dt, player.vy * dt);
    player.hitCooldown = Math.max(0, player.hitCooldown - dt);
    if (Math.hypot(player.vx, player.vy) > 38) {
      player.trail.push({ x: player.x, y: player.y, life: .35 });
      if (player.trail.length > 13) player.trail.shift();
    }
    player.trail.forEach((dot) => { dot.life -= dt; });
    player.trail = player.trail.filter((dot) => dot.life > 0);
  });

  const hazards = hazardRects(now - runState.startedAt);
  players.forEach((player) => {
    for (const hazard of hazards) {
      if (circleHitsRect(player.x, player.y, player.radius - 5, hazard)) {
        hitPlayer(player);
        break;
      }
    }
  });

  const occupancy = computePlateOccupancy(players);
  const activeCount = occupancy.filter(Boolean).length;
  const extractedCount = runState.coreUnlocked ? countExtractedPlayers(players) : 0;
  const nextState = updateObjectiveState(runState, {
    deltaMs: dt * 1000,
    allPlatesActive: activeCount === PLATE_DEFINITIONS.length,
    extractedCount,
    now,
  });

  if (activeCount > lastPlateCount) {
    occupancy.forEach((active, index) => {
      if (active) {
        const plate = PLATE_DEFINITIONS[index];
        const player = players[index];
        spawnBurst(plate.x, plate.y, player.color, 5, 55);
      }
    });
    beep(330 + activeCount * 55, .035, .012);
  }
  lastPlateCount = activeCount;

  if (nextState.phase !== lastPhase) {
    if (nextState.phase === "extraction") {
      showBanner("CORE UNLOCKED — ALL PLAYERS TO EXTRACTION");
      spawnBurst(WORLD.width / 2, 205, "#8ff6ff", 46, 300);
      shake = 11;
      chord([392, 523.25, 659.25]);
    } else if (nextState.phase === "cleared") {
      spawnBurst(WORLD.width / 2, 120, "#ffffff", 64, 360);
      shake = 14;
      chord([523.25, 659.25, 783.99, 1046.5], .12);
      setTimeout(showResult, 460);
    }
    lastPhase = nextState.phase;
  }
  runState = nextState;

  particles.forEach((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= Math.pow(.08, dt);
    particle.vy *= Math.pow(.08, dt);
    particle.life -= dt;
  });
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    if (particles[i].life <= 0) particles.splice(i, 1);
  }
  shake *= Math.pow(.025, dt);
  updateHud();
}

function updateHud() {
  const progress = Math.round((runState.syncProgressMs / SYNC_HOLD_MS) * 100);
  syncFill.style.width = `${progress}%`;
  syncText.textContent = runState.coreUnlocked ? "LINKED" : `${progress}%`;
  missionText.textContent = runState.coreUnlocked
    ? `EXTRACTION ${runState.extractedCount}/4`
    : "SYNC ALL 4 SIGNALS";
  const end = runState.endedAt ?? elapsedNow;
  timerText.textContent = formatElapsed(running ? end - runState.startedAt : 0);
  hitText.textContent = String(runState.hazardHits);
}

function showResult() {
  if (runState.phase !== "cleared") return;
  running = false;
  document.querySelector("#resultTime").textContent = formatElapsed(runState.endedAt - runState.startedAt);
  document.querySelector("#resultHits").textContent = String(runState.hazardHits);
  showOverlay(resultOverlay);
}

function showBanner(message) {
  phaseBanner.textContent = message;
  phaseBanner.hidden = false;
  phaseBanner.style.opacity = "1";
  clearTimeout(bannerTimeout);
  bannerTimeout = setTimeout(() => {
    phaseBanner.style.opacity = "0";
    setTimeout(() => { phaseBanner.hidden = true; }, 220);
  }, 1600);
}

function ensureAudio() {
  if (!audioEnabled) return null;
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }
  if (audioContext.state === "suspended") audioContext.resume();
  return audioContext;
}

function beep(frequency = 440, duration = .05, gain = .025, type = "sine") {
  const audio = ensureAudio();
  if (!audio) return;
  const oscillator = audio.createOscillator();
  const volume = audio.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime);
  volume.gain.setValueAtTime(gain, audio.currentTime);
  volume.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + duration);
  oscillator.connect(volume).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
}

function chord(notes, duration = .09) {
  notes.forEach((note, index) => setTimeout(() => beep(note, duration, .022), index * 45));
}

function roundedRectPath(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.roundRect(x, y, width, height, r);
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = "rgba(96, 205, 239, .055)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= WORLD.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, WORLD.height); ctx.stroke();
  }
  for (let y = 0; y <= WORLD.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WORLD.width, y); ctx.stroke();
  }
  ctx.restore();
}

function drawArenaBackground(now) {
  const gradient = ctx.createRadialGradient(640, 330, 30, 640, 330, 700);
  gradient.addColorStop(0, runState.coreUnlocked ? "#0d2833" : "#0a1c2a");
  gradient.addColorStop(.5, "#07131f");
  gradient.addColorStop(1, "#030811");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WORLD.width, WORLD.height);
  drawGrid();

  ctx.save();
  ctx.strokeStyle = "rgba(108, 213, 247, .13)";
  ctx.lineWidth = 2;
  roundedRectPath(ctx, 22, 22, WORLD.width - 44, WORLD.height - 44, 24);
  ctx.stroke();
  ctx.setLineDash([4, 14]);
  ctx.strokeStyle = "rgba(83, 232, 255, .09)";
  roundedRectPath(ctx, 38, 38, WORLD.width - 76, WORLD.height - 76, 20);
  ctx.stroke();
  ctx.restore();

  const pulse = .5 + Math.sin(now / 700) * .18;
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = runState.coreUnlocked ? "#8ff6ff" : "rgba(83,232,255,.28)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(640, 205, 56, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(640, 205, 77, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

function drawObstacles() {
  obstacles.forEach((rect, index) => {
    const g = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
    g.addColorStop(0, "rgba(30, 65, 82, .95)");
    g.addColorStop(1, "rgba(8, 24, 36, .95)");
    ctx.fillStyle = g;
    roundedRectPath(ctx, rect.x, rect.y, rect.width, rect.height, 16);
    ctx.fill();
    ctx.strokeStyle = "rgba(106, 199, 235, .22)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "rgba(83,232,255,.05)";
    ctx.fillRect(rect.x + 10, rect.y + 8, rect.width - 20, 3);
    ctx.fillStyle = "rgba(133,194,219,.22)";
    ctx.font = "700 10px system-ui";
    ctx.fillText(`NODE ${String(index + 1).padStart(2, "0")}`, rect.x + 12, rect.y + rect.height - 12);
  });
}

function drawCore(now) {
  const charge = runState.syncProgressMs / SYNC_HOLD_MS;
  const glow = 16 + charge * 32 + Math.sin(now / 160) * 4;
  ctx.save();
  ctx.shadowColor = runState.coreUnlocked ? "#b8fbff" : "#53e8ff";
  ctx.shadowBlur = glow;
  ctx.fillStyle = runState.coreUnlocked ? "#e7feff" : `rgba(83,232,255,${.18 + charge * .55})`;
  ctx.beginPath(); ctx.arc(640, 205, 22 + charge * 8, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = runState.coreUnlocked ? "rgba(255,255,255,.8)" : "rgba(83,232,255,.35)";
  ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(640, 205, 38, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * charge); ctx.stroke();
  ctx.fillStyle = "rgba(191,237,248,.72)";
  ctx.font = "900 11px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(runState.coreUnlocked ? "CORE OPEN" : "SIGNAL CORE", 640, 258);
  ctx.restore();
}

function drawPlates(occupancy, now) {
  PLATE_DEFINITIONS.forEach((plate, index) => {
    const player = players[index] ?? PLAYER_DEFINITIONS[index];
    const active = occupancy[index];
    const pulse = active ? 1 + Math.sin(now / 120 + index) * .05 : 1;
    ctx.save();
    ctx.translate(plate.x, plate.y);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "rgba(5,14,24,.86)";
    ctx.beginPath(); ctx.arc(0, 0, plate.radius + 9, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = active ? player.color : `${player.color}55`;
    ctx.lineWidth = active ? 6 : 3;
    ctx.shadowColor = player.color;
    ctx.shadowBlur = active ? 24 : 5;
    ctx.beginPath(); ctx.arc(0, 0, plate.radius, 0, Math.PI * 2); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = active ? `${player.color}33` : `${player.color}0f`;
    ctx.beginPath(); ctx.arc(0, 0, plate.radius - 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = active ? "#ffffff" : player.color;
    ctx.font = "900 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(player.label, 0, 4);
    ctx.restore();
  });
}

function drawExtraction(now) {
  const zone = EXTRACTION_ZONE;
  const active = runState.coreUnlocked;
  ctx.save();
  ctx.globalAlpha = active ? .95 : .28;
  const g = ctx.createLinearGradient(zone.x, zone.y, zone.x, zone.y + zone.height);
  g.addColorStop(0, active ? "rgba(119,244,255,.22)" : "rgba(90,112,124,.08)");
  g.addColorStop(1, "rgba(22,72,88,.06)");
  ctx.fillStyle = g;
  roundedRectPath(ctx, zone.x, zone.y, zone.width, zone.height, 16); ctx.fill();
  ctx.strokeStyle = active ? "#8ff6ff" : "rgba(134,164,177,.26)";
  ctx.lineWidth = active ? 3 : 2;
  ctx.setLineDash(active ? [10, 8] : [4, 12]);
  ctx.lineDashOffset = active ? -(now / 28) : 0;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = active ? "#dffcff" : "#738692";
  ctx.font = "900 13px system-ui";
  ctx.textAlign = "center";
  ctx.fillText(active ? `EXTRACTION ${runState.extractedCount}/4` : "EXTRACTION LOCKED", zone.x + zone.width / 2, zone.y + zone.height / 2 + 5);
  ctx.restore();
}

function drawHazards(now) {
  hazardRects(now - runState.startedAt).forEach((beam, index) => {
    ctx.save();
    const glowColor = index === 0 ? "#ff5b74" : "#f6925a";
    ctx.fillStyle = `${glowColor}12`;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 25;
    ctx.fillRect(beam.x - (beam.axis === "v" ? 8 : 0), beam.y - (beam.axis === "h" ? 8 : 0), beam.width + (beam.axis === "v" ? 16 : 0), beam.height + (beam.axis === "h" ? 16 : 0));
    ctx.shadowBlur = 12;
    ctx.fillStyle = glowColor;
    ctx.globalAlpha = beam.alpha;
    ctx.fillRect(beam.x, beam.y, beam.width, beam.height);
    ctx.restore();
  });
}

function drawPlayers() {
  players.forEach((player, index) => {
    player.trail.forEach((dot) => {
      ctx.save();
      ctx.globalAlpha = Math.min(.24, dot.life * .65);
      ctx.fillStyle = player.color;
      ctx.beginPath(); ctx.arc(dot.x, dot.y, 9 * dot.life, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    });

    ctx.save();
    ctx.translate(player.x, player.y);
    if (mode === "solo" && index === activePlayerIndex) {
      ctx.strokeStyle = "rgba(255,255,255,.7)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.arc(0, 0, player.radius + 11, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.shadowColor = player.color;
    ctx.shadowBlur = player.hitCooldown > 0 ? 7 : 20;
    ctx.fillStyle = player.hitCooldown > 0 ? "rgba(255,255,255,.75)" : player.color;
    roundedRectPath(ctx, -player.radius, -player.radius, player.radius * 2, player.radius * 2, 11);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(4,13,21,.88)";
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 9px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(player.label, 0, 3);
    ctx.fillStyle = "rgba(226,249,255,.72)";
    ctx.font = "800 9px system-ui";
    ctx.fillText(player.name.toUpperCase(), 0, 38);
    ctx.restore();
  });
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, particle.life / particle.maxLife));
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 9;
    ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
}

function draw(now) {
  const cssWidth = canvas.clientWidth || 1280;
  const cssHeight = canvas.clientHeight || 720;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.round(cssWidth * dpr);
  const height = Math.round(cssHeight * dpr);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width / WORLD.width, height / WORLD.height);
  const offsetX = (width - WORLD.width * scale) / 2;
  const offsetY = (height - WORLD.height * scale) / 2;
  const jitterX = shake ? (Math.random() - .5) * shake * dpr : 0;
  const jitterY = shake ? (Math.random() - .5) * shake * dpr : 0;
  ctx.setTransform(scale, 0, 0, scale, offsetX + jitterX, offsetY + jitterY);

  drawArenaBackground(now);
  drawExtraction(now);
  drawObstacles();
  drawCore(now);
  const occupancy = computePlateOccupancy(players);
  drawPlates(occupancy, now);
  if (running) drawHazards(now);
  drawPlayers();
  drawParticles();
}

function frame(now) {
  const dt = Math.min(.033, Math.max(0, (now - lastTime) / 1000));
  lastTime = now;
  update(dt, now);
  draw(now);
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
  if (event.code === "Digit1") selectPlayer(0);
  if (event.code === "Digit2") selectPlayer(1);
  if (event.code === "Digit3") selectPlayer(2);
  if (event.code === "Digit4") selectPlayer(3);
  if (event.code === "Escape" && rulesOverlay.classList.contains("is-visible")) closeRules();
  keyState.add(event.code);
});
window.addEventListener("keyup", (event) => keyState.delete(event.code));
window.addEventListener("blur", () => keyState.clear());
document.addEventListener("visibilitychange", () => { if (document.hidden) keyState.clear(); });

playerChips.forEach((chip) => chip.addEventListener("click", () => selectPlayer(Number(chip.dataset.playerSelect))));
document.querySelectorAll("[data-touch]").forEach((button) => {
  const direction = button.dataset.touch;
  const on = (event) => { event.preventDefault(); touchState.add(direction); };
  const off = (event) => { event.preventDefault(); touchState.delete(direction); };
  button.addEventListener("pointerdown", on);
  button.addEventListener("pointerup", off);
  button.addEventListener("pointercancel", off);
  button.addEventListener("pointerleave", off);
});

document.querySelector("#startSolo").addEventListener("click", () => begin("solo"));
document.querySelector("#startLocal").addEventListener("click", () => begin("local"));
document.querySelector("#entryRules").addEventListener("click", openRules);
document.querySelector("#rulesButton").addEventListener("click", openRules);
document.querySelectorAll("[data-close-rules]").forEach((button) => button.addEventListener("click", closeRules));
document.querySelector("#restartButton").addEventListener("click", () => {
  if (running) {
    resetRun();
    showBanner("RUN RESET");
    beep(240, .05, .025);
  }
});
document.querySelector("#endButton").addEventListener("click", endSession);
document.querySelector("#replayButton").addEventListener("click", () => begin(mode));
document.querySelector("#resultExit").addEventListener("click", endSession);
document.querySelector("#soundToggle").addEventListener("click", (event) => {
  audioEnabled = !audioEnabled;
  event.currentTarget.textContent = audioEnabled ? "SOUND ON" : "SOUND OFF";
  event.currentTarget.setAttribute("aria-pressed", String(audioEnabled));
  if (audioEnabled) beep(520, .05, .02);
});

resetRun({ keepMode: false });
entryOverlay.hidden = false;
requestAnimationFrame(frame);
