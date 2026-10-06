// ==========================================
// TOWER KICK: J2ME RETRO ARCADE CLIMBER
// İKİ BAŞPARMAK MOMENTUM + TİTREŞİM (HAPTIC) + HIZLI BUZLAR
// + MAĞAZA & KİŞİSELLEŞTİRME SİSTEMİ
// ==========================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

if (ctx && typeof ctx.roundRect !== 'function') {
  ctx.roundRect = function (x, y, w, h, r) {
    const rad = Math.max(0, typeof r === 'number' ? r : 0);
    this.moveTo(x + rad, y);
    this.arcTo(x + w, y, x + w, y + h, rad);
    this.arcTo(x + w, y + h, x, y + h, rad);
    this.arcTo(x, y + h, x, y, rad);
    this.arcTo(x, y, x + w, y, rad);
    this.closePath();
  };
}

// UI Elemanları
const scoreValEl = document.getElementById('scoreVal');
const bestValEl = document.getElementById('bestVal');
const soundBtn = document.getElementById('soundBtn');
const comfortBtn = document.getElementById('comfortBtn');
const menuBtn = document.getElementById('menuBtn');
const lavaDanger = document.getElementById('lavaDanger');

const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');

const comboContainer = document.getElementById('comboContainer');
const comboTextEl = document.getElementById('comboText');
const comboFillEl = document.getElementById('comboFill');
const comboMultiplierEl = document.getElementById('comboMultiplier');

const startOverlay = document.getElementById('startOverlay');
const playBtn = document.getElementById('playBtn');

const pauseOverlay = document.getElementById('pauseOverlay');
const resumeBtn = document.getElementById('resumeBtn');
const inGameRestartBtn = document.getElementById('inGameRestartBtn');
const mainMenuBtn = document.getElementById('mainMenuBtn');
const pauseCurrentFloor = document.getElementById('pauseCurrentFloor');
const pauseBestFloor = document.getElementById('pauseBestFloor');

const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreEl = document.getElementById('finalScore');
const finalBestEl = document.getElementById('finalBest');
const nearMissNoticeEl = document.getElementById('nearMissNotice');
const nearMissDiffEl = document.getElementById('nearMissDiff');
const reviveBtn = document.getElementById('reviveBtn');
const restartBtn = document.getElementById('restartBtn');

// Mağaza & Coin UI Elemanları
const shopOverlay = document.getElementById('shopOverlay');
const shopCloseBtn = document.getElementById('shopCloseBtn');
const shopBtn = document.getElementById('shopBtn');
const coinValEl = document.getElementById('coinVal');
const shopCoinsEl = document.getElementById('shopCoins');
const shopGrid = document.getElementById('shopGrid');
const categoryTabs = document.querySelectorAll('.shop-cat-tab');

// Yeni Sistem UI Elemanları
const timeBadge = document.getElementById('timeBadge');
const timeVal = document.getElementById('timeVal');
const activePowerUpEl = document.getElementById('activePowerUp');
const powerUpIconEl = document.getElementById('powerUpIcon');
const powerUpNameEl = document.getElementById('powerUpName');
const powerUpBarEl = document.getElementById('powerUpBar');
const powerUpTimeEl = document.getElementById('powerUpTime');
const biomeBannerEl = document.getElementById('biomeBanner');
const biomeIconEl = document.getElementById('biomeIcon');
const biomeNameEl = document.getElementById('biomeName');
const modeButtons = document.querySelectorAll('.mode-btn');
const questBtn = document.getElementById('questBtn');
const pauseQuestBtn = document.getElementById('pauseQuestBtn');
const questOverlay = document.getElementById('questOverlay');
const questCloseBtn = document.getElementById('questCloseBtn');
const questListEl = document.getElementById('questList');

// Çark, Ayarlar ve Bölümler UI Elemanları
const wheelBtn = document.getElementById('wheelBtn');
const wheelOverlay = document.getElementById('wheelOverlay');
const wheelCloseBtn = document.getElementById('wheelCloseBtn');
const wheelDisc = document.getElementById('wheelDisc');
const spinBtn = document.getElementById('spinBtn');
const wheelStatus = document.getElementById('wheelStatus');

const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');
const bgmToggleBtn = document.getElementById('bgmToggleBtn');
const sfxToggleBtn = document.getElementById('sfxToggleBtn');
const hapticToggleBtn = document.getElementById('hapticToggleBtn');
const speedToggleBtn = document.getElementById('speedToggleBtn');
const touchLayoutBtn = document.getElementById('touchLayoutBtn');
const bindLeftBtn = document.getElementById('bindLeftBtn');
const bindRightBtn = document.getElementById('bindRightBtn');
const bindJumpBtn = document.getElementById('bindJumpBtn');
const bindPauseBtn = document.getElementById('bindPauseBtn');
const resetBindsBtn = document.getElementById('resetBindsBtn');
const settingsQuestBtn = document.getElementById('settingsQuestBtn');
const settingsStreakBtn = document.getElementById('settingsStreakBtn');
const settingsWheelBtn = document.getElementById('settingsWheelBtn');
const lowFxToggleBtn = document.getElementById('lowFxToggleBtn');
const scoresBtn = document.getElementById('scoresBtn');
const scoresOverlay = document.getElementById('scoresOverlay');
const scoresCloseBtn = document.getElementById('scoresCloseBtn');
const scoresListEl = document.getElementById('scoresList');

const levelsOverlay = document.getElementById('levelsOverlay');
const levelsCloseBtn = document.getElementById('levelsCloseBtn');
const levelsGrid = document.getElementById('levelsGrid');
const levelClearOverlay = document.getElementById('levelClearOverlay');
const levelClearText = document.getElementById('levelClearText');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const levelClearMenuBtn = document.getElementById('levelClearMenuBtn');

// Yeni Bağımlılık Yapan Mekanikler UI Elemanları
const feverOverlay = document.getElementById('feverOverlay');
const recordBrokenBanner = document.getElementById('recordBrokenBanner');
const streakBtn = document.getElementById('streakBtn');
const streakOverlay = document.getElementById('streakOverlay');
const streakCloseBtn = document.getElementById('streakCloseBtn');
const streakGrid = document.getElementById('streakGrid');
const claimStreakBtn = document.getElementById('claimStreakBtn');
const tutorialOverlay = document.getElementById('tutorialOverlay');
const tutorialOkBtn = document.getElementById('tutorialOkBtn');
const deathTipEl = document.getElementById('deathTip');
const dailyGiftBtn = document.getElementById('dailyGiftBtn');
const gameOverMenuBtn = document.getElementById('gameOverMenuBtn');
let biomeHoldTimer = 0;
let pendingTutorialStart = false;

let feverTimer = 0;
let isFeverActive = false;
let recordBrokenThisRun = false;

// ==========================================
// TİTREŞİM (HAPTIC FEEDBACK) & HIZ AYARI
// ==========================================
let hapticSetting = localStorage.getItem('towerkick_haptic') || 'high'; // 'high', 'low', 'off'
let speedSetting = localStorage.getItem('towerkick_speed') || 'normal'; // 'normal', 'fast'
let touchLayoutSwapped = localStorage.getItem('towerkick_touch_swap') === '1';
let lowFx = localStorage.getItem('towerkick_lowfx') === '1';

const DEFAULT_KEYBINDS = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  jump: 'Space',
  pause: 'Escape'
};

function loadKeybinds() {
  try {
    const raw = localStorage.getItem('towerkick_keybinds');
    if (!raw) return { ...DEFAULT_KEYBINDS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_KEYBINDS, ...parsed };
  } catch (e) {
    return { ...DEFAULT_KEYBINDS };
  }
}

let keybinds = loadKeybinds();
let pendingBindAction = null; // 'left' | 'right' | 'jump' | 'pause' | null

function saveKeybinds() {
  localStorage.setItem('towerkick_keybinds', JSON.stringify(keybinds));
}

function formatKeyCode(code) {
  if (!code) return '?';
  if (code === 'Space') return 'Space';
  if (code === 'Escape') return 'Esc';
  if (code.startsWith('Arrow')) return ({ ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓' })[code] || code;
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
}

function applyTouchLayout() {
  const layer = document.getElementById('touchControls');
  if (!layer) return;
  layer.classList.toggle('swapped', touchLayoutSwapped);
  if (touchLayoutBtn) {
    touchLayoutBtn.textContent = touchLayoutSwapped ? 'TERS' : 'NORMAL';
    touchLayoutBtn.classList.toggle('active', touchLayoutSwapped);
  }
}

function vibrate(ms) {
  if (hapticSetting === 'off') return;
  if (lowFx) {
    if (Array.isArray(ms)) ms = ms.map(m => Math.max(4, Math.floor(m * 0.35)));
    else ms = Math.max(4, Math.floor(ms * 0.35));
  }
  try {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
      const Haptics = window.Capacitor.Plugins.Haptics;
      if (typeof ms === 'number' && ms >= 30) {
        Haptics.impact({ style: 'Heavy' });
      } else {
        Haptics.impact({ style: 'Light' });
      }
      return;
    }
  } catch (e) {}

  if ('vibrate' in navigator) {
    try {
      if (hapticSetting === 'low') {
        if (Array.isArray(ms)) {
          navigator.vibrate(ms.map(m => Math.max(5, Math.floor(m * 0.5))));
        } else {
          navigator.vibrate(Math.max(5, Math.floor(ms * 0.5)));
        }
      } else {
        navigator.vibrate(ms);
      }
    } catch (e) {}
  }
}

// ==========================================
// SES MOTORU & RETRO BGM (Web Audio API)
// ==========================================
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('towerkick_sfx') !== '0';
    this.bgmEnabled = localStorage.getItem('towerkick_bgm') !== '0';
    this.bgmTimer = null;
    this.bgmStep = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startBGM() {
    if (!this.bgmEnabled || this.bgmTimer) return;
    this.init();
    if (!this.ctx) return;

    const themes = {
      plain: {
        bass: [130.81, 130.81, 155.56, 155.56, 174.61, 174.61, 196.00, 196.00, 130.81, 130.81, 155.56, 155.56, 116.54, 116.54, 130.81, 146.83],
        lead: [261.63, 0, 311.13, 392.00, 0, 349.23, 311.13, 0, 523.25, 392.00, 0, 311.13, 293.66, 311.13, 261.63, 0],
        bassType: 'triangle', leadType: 'sine'
      },
      neon: {
        bass: [146.83, 146.83, 174.61, 174.61, 196.00, 196.00, 220.00, 220.00, 146.83, 146.83, 174.61, 174.61, 130.81, 130.81, 146.83, 164.81],
        lead: [587.33, 0, 698.46, 880.00, 0, 783.99, 698.46, 0, 1174.7, 880.00, 0, 698.46, 659.25, 698.46, 587.33, 0],
        bassType: 'square', leadType: 'square'
      },
      ice: {
        bass: [174.61, 174.61, 196.00, 196.00, 220.00, 220.00, 246.94, 246.94, 174.61, 174.61, 196.00, 196.00, 164.81, 164.81, 174.61, 196.00],
        lead: [523.25, 0, 659.25, 783.99, 0, 698.46, 659.25, 0, 1046.5, 783.99, 0, 659.25, 587.33, 659.25, 523.25, 0],
        bassType: 'triangle', leadType: 'triangle'
      },
      magma: {
        bass: [98.00, 98.00, 110.00, 110.00, 130.81, 130.81, 146.83, 146.83, 98.00, 98.00, 110.00, 110.00, 87.31, 87.31, 98.00, 110.00],
        lead: [196.00, 0, 246.94, 293.66, 0, 261.63, 246.94, 0, 392.00, 293.66, 0, 246.94, 220.00, 246.94, 196.00, 0],
        bassType: 'sawtooth', leadType: 'sawtooth'
      },
      space: {
        bass: [110.00, 0, 130.81, 0, 146.83, 0, 164.81, 0, 110.00, 0, 130.81, 0, 98.00, 0, 110.00, 123.47],
        lead: [440.00, 0, 0, 554.37, 0, 659.25, 0, 0, 880.00, 0, 659.25, 0, 554.37, 0, 440.00, 0],
        bassType: 'sine', leadType: 'sine'
      }
    };

    this.bgmStep = 0;
    this.bgmTimer = setInterval(() => {
      if (!this.bgmEnabled || currentState !== GAME_STATE.PLAYING) return;
      if (!this.ctx || this.ctx.state === 'suspended') return;

      const theme = (typeof getCurrentBiome === 'function' && getCurrentBiome()) ? getCurrentBiome().theme : 'plain';
      const pack = themes[theme] || themes.plain;
      const step = this.bgmStep % 16;
      this.bgmStep++;

      const now = this.ctx.currentTime;
      const stepDuration = 0.135;

      const bassFreq = pack.bass[step];
      if (bassFreq > 0) {
        try {
          const oscB = this.ctx.createOscillator();
          const gainB = this.ctx.createGain();
          oscB.type = pack.bassType;
          oscB.frequency.setValueAtTime(bassFreq, now);
          gainB.gain.setValueAtTime(theme === 'magma' ? 0.03 : 0.04, now);
          gainB.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.9);
          oscB.connect(gainB);
          gainB.connect(this.ctx.destination);
          oscB.start(now);
          oscB.stop(now + stepDuration);
        } catch (e) {}
      }

      const leadFreq = pack.lead[step];
      if (leadFreq > 0) {
        try {
          const oscL = this.ctx.createOscillator();
          const gainL = this.ctx.createGain();
          oscL.type = pack.leadType;
          oscL.frequency.setValueAtTime(leadFreq, now);
          gainL.gain.setValueAtTime(0.03, now);
          gainL.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 0.85);
          oscL.connect(gainL);
          gainL.connect(this.ctx.destination);
          oscL.start(now);
          oscL.stop(now + stepDuration);
        } catch (e) {}
      }
    }, 140);
  }

  playBiomeSting(theme) {
    if (!this.bgmEnabled) return;
    this.init();
    if (!this.ctx) return;
    const motifs = {
      neon: [659.25, 783.99, 987.77, 1174.66, 987.77, 783.99],
      ice: [523.25, 659.25, 783.99, 987.77, 880.00, 659.25],
      magma: [196.00, 246.94, 293.66, 220.00, 164.81, 196.00],
      space: [440.00, 554.37, 659.25, 880.00, 659.25, 554.37],
      plain: [261.63, 329.63, 392.00, 349.23, 329.63, 261.63]
    };
    const oscType = theme === 'magma' ? 'sawtooth' : theme === 'neon' ? 'square' : theme === 'ice' ? 'triangle' : 'sine';
    const notes = motifs[theme] || motifs.plain;
    const now = this.ctx.currentTime;
    notes.forEach((freq, i) => {
      const t = now + i * 0.48;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = oscType;
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.065, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      } catch (e) {}
    });
  }

  stopBGM() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playTone(freq, type, duration, endFreq = null, gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      if (endFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), this.ctx.currentTime + duration);
      }

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  jump(boosted = false) {
    const theme = (typeof getCurrentBiome === 'function' && BIOMES) ? getCurrentBiome().theme : 'magma';
    if (theme === 'neon') {
      this.playTone(boosted ? 620 : 480, 'square', 0.09, boosted ? 980 : 720, 0.16);
      setTimeout(() => this.playTone(boosted ? 880 : 640, 'square', 0.07, 220, 0.12), 50);
    } else if (theme === 'ice') {
      this.playTone(boosted ? 520 : 400, 'triangle', 0.16, 880, 0.18);
    } else if (theme === 'space') {
      this.playTone(boosted ? 260 : 200, 'sine', 0.28, 140, 0.2);
    } else {
      this.playTone(boosted ? 340 : 280, 'sine', boosted ? 0.2 : 0.15, boosted ? 780 : 540, boosted ? 0.28 : 0.2);
    }
  }

  wallKick() {
    this.playTone(180, 'triangle', 0.26, 850, 0.35);
  }

  spring() {
    this.playTone(380, 'sine', 0.4, 980, 0.3);
  }

  iceCrack() {
    this.playTone(650, 'sawtooth', 0.08, 110, 0.22);
  }

  combo(mult) {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    const note = notes[Math.min(mult - 1, notes.length - 1)];
    this.playTone(note, 'sine', 0.22, note * 1.25, 0.25);
  }

  gem() {
    this.playTone(880, 'sine', 0.14, 1320, 0.25);
  }

  fall() {
    this.playTone(380, 'sawtooth', 0.3, 80, 0.2);
  }

  purchase() {
    this.playTone(523.25, 'sine', 0.12, 1046.50, 0.3);
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 1318.51, 0.25), 120);
  }

  doubleJump() {
    this.playTone(480, 'triangle', 0.18, 920, 0.28);
  }

  magnet() {
    this.playTone(587.33, 'sine', 0.3, 1174.66, 0.25);
  }

  shield() {
    this.playTone(440, 'triangle', 0.25, 880, 0.25);
  }

  shieldBreak() {
    this.playTone(220, 'sawtooth', 0.35, 110, 0.35);
  }

  freeze() {
    this.playTone(800, 'sine', 0.3, 1600, 0.28);
  }

  jetpack() {
    this.playTone(150, 'sawtooth', 0.2, 300, 0.18);
  }

  portal() {
    this.playTone(320, 'sine', 0.35, 960, 0.3);
  }

  bombTick() {
    this.playTone(880, 'square', 0.08, 880, 0.2);
  }

  bombExplode() {
    this.playTone(120, 'sawtooth', 0.4, 40, 0.35);
  }

  stomp() {
    this.playTone(300, 'triangle', 0.18, 600, 0.3);
  }

  burn() {
    this.playTone(180, 'sawtooth', 0.45, 45, 0.32);
  }
}

const sounds = new SoundSystem();

// ==========================================
// MAĞAZA SİSTEMİ (SHOP SYSTEM)
// ==========================================
const SHOP_ITEMS = {
  charShape: [
    { id: 'shape_rect', name: 'Klasik Kutu', preview: 'rect', price: 0 },
    { id: 'shape_slime', name: 'Slime Blob', preview: 'slime', price: 0 },
  ],
  wallColor: [
    { id: 'wall_default', name: 'Neon Cyan', preview: '#00f0ff', price: 0 },
    { id: 'wall_pink', name: 'Neon Pembe', preview: '#ff007f', price: 5 },
    { id: 'wall_green', name: 'Neon Yeşil', preview: '#00ff66', price: 5 },
    { id: 'wall_purple', name: 'Neon Mor', preview: '#9d00ff', price: 8 },
    { id: 'wall_orange', name: 'Neon Turuncu', preview: '#ff5e00', price: 8 },
    { id: 'wall_rainbow', name: 'Gökkuşağı', preview: 'rainbow', price: 20 },
  ],
  charColor: [
    { id: 'char_default', name: 'Neon Döngü', preview: 'cycle', price: 0 },
    { id: 'char_cyan', name: 'Sabit Cyan', preview: '#00f0ff', price: 5 },
    { id: 'char_pink', name: 'Sabit Pembe', preview: '#ff007f', price: 5 },
    { id: 'char_yellow', name: 'Sabit Sarı', preview: '#ffe600', price: 5 },
    { id: 'char_rainbow', name: 'Gökkuşağı', preview: 'rainbow', price: 15 },
    { id: 'char_fire', name: 'Ateş Parıltısı', preview: 'fire', price: 20 },
    { id: 'char_electric', name: 'Elektrik Kıvılcımı', preview: 'electric', price: 25 },
    { id: 'char_cosmic', name: 'Kozmik Süperstar', preview: 'cosmic', price: 150 },
  ],
  trailStyle: [
    { id: 'trail_drop', name: 'Damla İzi', preview: 'drop', price: 0 },
    { id: 'trail_star', name: 'Yıldız İzi', preview: 'star', price: 8 },
    { id: 'trail_heart', name: 'Kalp İzi', preview: 'heart', price: 10 },
    { id: 'trail_flame', name: 'Alev İzi', preview: 'flame', price: 12 },
    { id: 'trail_bubble', name: 'Baloncuk İzi', preview: 'bubble', price: 14 },
    { id: 'trail_lightning', name: 'Yıldırım İzi', preview: 'lightning', price: 16 },
  ],
  eyes: [
    { id: 'eye_normal', name: 'Normal Bakış', preview: 'normal', price: 0 },
    { id: 'eye_angry', name: 'Öfkeli Bakış', preview: 'angry', price: 5 },
    { id: 'eye_happy', name: 'Neşeli Bakış', preview: 'happy', price: 5 },
    { id: 'eye_sunglasses', name: 'Cool Güneş Gözlüğü', preview: 'sunglasses', price: 10 },
    { id: 'eye_patch', name: 'Korsan Bandı', preview: 'patch', price: 12 },
    { id: 'eye_cyclops', name: 'Tepegöz Vizörü', preview: 'cyclops', price: 15 },
    { id: 'eye_laser', name: 'Robot Lazer Gözü', preview: 'laser', price: 18 },
  ],
  hats: [
    { id: 'hat_none', name: 'Şapkasız', preview: 'none', price: 0 },
    { id: 'hat_crown', name: 'Kraliyet Tacı', preview: 'crown', price: 15 },
    { id: 'hat_party', name: 'Parti Külahı', preview: 'party', price: 10 },
    { id: 'hat_ninja', name: 'Ninja Bandı', preview: 'ninja', price: 12 },
    { id: 'hat_helmet', name: 'İşçi Bareti', preview: 'helmet', price: 8 },
    { id: 'hat_flower', name: 'Bahar Çiçeği', preview: 'flower', price: 10 },
    { id: 'hat_halo', name: 'Işık Halesi', preview: 'halo', price: 20 },
  ],
};

class ShopSystem {
  constructor() {
    this.coins = 0;
    this.owned = {};    // { itemId: true }
    this.equipped = {}; // { category: itemId }
    this.currentCategory = 'charShape';
    this.load();
  }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem('towerkick_shop') || '{}');
      this.coins = saved.coins || 0;
      this.owned = saved.owned || {};
      this.equipped = saved.equipped || {};
    } catch (e) {
      this.coins = 0;
      this.owned = {};
      this.equipped = {};
    }

    // Varsayılan öğeler daima sahip olunan
    for (const cat in SHOP_ITEMS) {
      SHOP_ITEMS[cat].forEach(item => {
        if (item.price === 0) this.owned[item.id] = true;
      });
      // Varsayılan equip
      if (!this.equipped[cat]) {
        this.equipped[cat] = SHOP_ITEMS[cat][0].id;
      }
    }
    this.updateCoinUI();
  }

  save() {
    localStorage.setItem('towerkick_shop', JSON.stringify({
      coins: this.coins,
      owned: this.owned,
      equipped: this.equipped,
    }));
  }

  addCoins(amount) {
    this.coins += amount;
    this.updateCoinUI();
    this.save();
  }

  canBuy(itemId) {
    if (this.owned[itemId]) return false;
    const item = this.findItem(itemId);
    return item && this.coins >= item.price;
  }

  buy(itemId) {
    const item = this.findItem(itemId);
    if (!item || this.owned[itemId]) return false;
    if (this.coins < item.price) return false;

    this.coins -= item.price;
    this.owned[itemId] = true;
    this.updateCoinUI();
    this.save();
    sounds.purchase();
    return true;
  }

  equip(category, itemId) {
    if (!this.owned[itemId]) return false;
    this.equipped[category] = itemId;
    this.save();
    return true;
  }

  getEquipped(category) {
    return this.equipped[category] || SHOP_ITEMS[category][0].id;
  }

  getEquippedItem(category) {
    const id = this.getEquipped(category);
    return this.findItem(id) || SHOP_ITEMS[category][0];
  }

  findItem(itemId) {
    for (const cat in SHOP_ITEMS) {
      const item = SHOP_ITEMS[cat].find(i => i.id === itemId);
      if (item) return item;
    }
    return null;
  }

  findCategory(itemId) {
    for (const cat in SHOP_ITEMS) {
      if (SHOP_ITEMS[cat].find(i => i.id === itemId)) return cat;
    }
    return null;
  }

  updateCoinUI() {
    if (coinValEl) coinValEl.textContent = this.coins;
    if (shopCoinsEl) shopCoinsEl.textContent = this.coins;
  }

  getWallColor(time) {
    const item = this.getEquippedItem('wallColor');
    if (item.preview === 'rainbow') {
      const hue = (time * 60) % 360;
      return `hsl(${hue}, 100%, 55%)`;
    }
    return item.preview;
  }

  getCharColor(time, vx, maxSpeed) {
    const item = this.getEquippedItem('charColor');
    const speedRatio = Math.abs(vx) / maxSpeed;

    if (item.preview === 'cycle') {
      // Orijinal neon döngü davranışı
      if (speedRatio > 0.7) return '#ffe600';
      if (vx >= 0.3) return '#00f0ff';
      if (vx <= -0.3) return '#ff007f';
      return '#ffe600';
    }
    if (item.preview === 'rainbow') {
      const hue = (time * 90) % 360;
      return `hsl(${hue}, 100%, 60%)`;
    }
    if (item.preview === 'fire') {
      const flicker = Math.sin(time * 8) * 0.5 + 0.5;
      const r = 255;
      const g = Math.floor(80 + flicker * 100);
      const b = Math.floor(flicker * 40);
      return `rgb(${r}, ${g}, ${b})`;
    }
    if (item.preview === 'electric') {
      const zap = Math.sin(time * 16) > 0;
      return zap ? '#00f0ff' : '#ffffff';
    }
    if (item.preview === 'cosmic') {
      const hue = (time * 50) % 360;
      return `hsl(${hue}, 95%, 65%)`;
    }
    return item.preview;
  }

  renderShop() {
    if (!shopGrid) return;
    shopGrid.innerHTML = '';
    const items = SHOP_ITEMS[this.currentCategory] || [];

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-item-card';
      const isOwned = this.owned[item.id];
      const isEquipped = this.equipped[this.currentCategory] === item.id;
      const canAfford = this.coins >= item.price;

      if (isEquipped) card.classList.add('equipped');
      if (isOwned) card.classList.add('owned');

      // Renk önizleme
      let previewHTML = '';
      if (this.currentCategory === 'wallColor' || this.currentCategory === 'charColor') {
        if (item.preview === 'rainbow') {
          previewHTML = '<div class="item-color-preview rainbow-preview"></div>';
        } else if (item.preview === 'cycle') {
          previewHTML = '<div class="item-color-preview cycle-preview"></div>';
        } else if (item.preview === 'fire') {
          previewHTML = '<div class="item-color-preview fire-preview"></div>';
        } else if (item.preview === 'electric') {
          previewHTML = '<div class="item-color-preview electric-preview"></div>';
        } else if (item.preview === 'cosmic') {
          previewHTML = '<div class="item-color-preview cosmic-preview"></div>';
        } else {
          previewHTML = `<div class="item-color-preview" style="background:${item.preview}; box-shadow: 0 0 12px ${item.preview};"></div>`;
        }
      } else {
        // Vektör/SVG grafiksel önizlemeler (Emoji içermez)
        const svgMap = {
          // Model / Shape
          'rect': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><rect x="4" y="4" width="24" height="24" rx="4" fill="#00f0ff" stroke="#fff" stroke-width="2"/><circle cx="11" cy="12" r="2.5" fill="#0f172a"/><circle cx="21" cy="12" r="2.5" fill="#0f172a"/></svg>',
          'slime': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><path d="M16 4 C24 4 28 14 28 22 C28 27 23 28 16 28 C9 28 4 27 4 22 C4 14 8 4 16 4 Z" fill="#00ffaa" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="18" r="2" fill="#0f172a"/><circle cx="20" cy="18" r="2" fill="#0f172a"/></svg>',
          // Trail
          'drop': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><path d="M16 4 C16 4 6 16 6 22 A10 10 0 0 0 26 22 C26 16 16 4 16 4 Z" fill="#00c8ff"/></svg>',
          'star': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><polygon points="16,2 20.5,11.5 31,13 23.5,20.5 25.5,31 16,26 6.5,31 8.5,20.5 1,13 11.5,11.5" fill="#ffd700" stroke="#ffaa00" stroke-width="1.5"/></svg>',
          'heart': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><path d="M16 28 C16 28 3 20 3 10 A7 7 0 0 1 16 7 A7 7 0 0 1 29 10 C29 20 16 28 16 28 Z" fill="#ff0055"/></svg>',
          'flame': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><path d="M16 2 C16 2 26 12 26 20 C26 26 21.5 30 16 30 C10.5 30 6 26 6 20 C6 14 11 8 16 2 Z" fill="#ff4400"/><path d="M16 12 C16 12 21 17 21 21 C21 24 18.5 27 16 27 C13.5 27 11 24 11 21 C11 18 13.5 15 16 12 Z" fill="#ffcc00"/></svg>',
          'bubble': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><circle cx="16" cy="16" r="12" fill="rgba(0,240,255,0.3)" stroke="#00f0ff" stroke-width="2"/><circle cx="12" cy="11" r="3" fill="#ffffff"/></svg>',
          'lightning': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><polygon points="18,2 6,17 15,17 13,30 26,13 17,13" fill="#ffe600" stroke="#ff8800" stroke-width="1.2"/></svg>',
          // Eyes
          'normal': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><circle cx="10" cy="16" r="6" fill="#fff"/><circle cx="22" cy="16" r="6" fill="#fff"/><circle cx="11" cy="16" r="3" fill="#0f172a"/><circle cx="23" cy="16" r="3" fill="#0f172a"/></svg>',
          'angry': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><circle cx="10" cy="17" r="5.5" fill="#fff"/><circle cx="22" cy="17" r="5.5" fill="#fff"/><circle cx="11" cy="17" r="3" fill="#ff0033"/><circle cx="23" cy="17" r="3" fill="#ff0033"/><line x1="5" y1="10" x2="14" y2="13" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><line x1="27" y1="10" x2="18" y2="13" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
          'happy': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><path d="M7 18 Q 11 11 15 18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M17 18 Q 21 11 25 18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
          'sunglasses': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><rect x="4" y="11" width="10" height="9" rx="2" fill="#1e293b" stroke="#00f0ff" stroke-width="1.5"/><rect x="18" y="11" width="10" height="9" rx="2" fill="#1e293b" stroke="#00f0ff" stroke-width="1.5"/><line x1="14" y1="15" x2="18" y2="15" stroke="#00f0ff" stroke-width="2"/></svg>',
          'patch': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><line x1="4" y1="9" x2="28" y2="21" stroke="#334155" stroke-width="2.5"/><circle cx="11" cy="15" r="6" fill="#111827" stroke="#475569" stroke-width="1.5"/><circle cx="22" cy="16" r="5.5" fill="#fff"/><circle cx="23" cy="16" r="2.8" fill="#0f172a"/></svg>',
          'cyclops': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><circle cx="16" cy="16" r="10" fill="#fff" stroke="#475569" stroke-width="1.5"/><circle cx="17" cy="16" r="5" fill="#0f172a"/><circle cx="14" cy="13" r="2" fill="#fff"/></svg>',
          'laser': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><rect x="4" y="12" width="24" height="8" rx="3" fill="#1e293b" stroke="#ff0055" stroke-width="1.5"/><rect x="12" y="14" width="8" height="4" rx="2" fill="#ff0055"/></svg>',
          // Hats
          'none': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><circle cx="16" cy="16" r="10" fill="none" stroke="#64748b" stroke-width="2"/><line x1="9" y1="9" x2="23" y2="23" stroke="#ef4444" stroke-width="2.5"/></svg>',
          'crown': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><polygon points="5,24 6,10 11,16 16,7 21,16 26,10 27,24" fill="#ffd700" stroke="#b45309" stroke-width="1.5"/><circle cx="16" cy="10" r="1.5" fill="#ff0055"/></svg>',
          'party': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><polygon points="16,3 8,26 24,26" fill="#ff007f" stroke="#ffe600" stroke-width="1.5"/><circle cx="16" cy="4" r="2.5" fill="#ffe600"/></svg>',
          'ninja': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><rect x="4" y="12" width="24" height="7" rx="2" fill="#18181b" stroke="#ef4444" stroke-width="1.2"/><path d="M26 16 C30 18 31 24 29 27" stroke="#18181b" stroke-width="2.5" fill="none"/></svg>',
          'helmet': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><path d="M6 21 C6 12 11 8 16 8 C21 8 26 12 26 21 Z" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/><rect x="4" y="21" width="24" height="4" rx="1.5" fill="#d97706"/></svg>',
          'flower': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><circle cx="16" cy="11" r="3.5" fill="#ec4899"/><circle cx="21" cy="15" r="3.5" fill="#ec4899"/><circle cx="19" cy="20" r="3.5" fill="#ec4899"/><circle cx="13" cy="20" r="3.5" fill="#ec4899"/><circle cx="11" cy="15" r="3.5" fill="#ec4899"/><circle cx="16" cy="16" r="3" fill="#facc15"/></svg>',
          'halo': '<svg viewBox="0 0 32 32" class="shop-svg-icon"><ellipse cx="16" cy="14" rx="11" ry="5" fill="none" stroke="#facc15" stroke-width="2.8"/><ellipse cx="16" cy="14" rx="11" ry="5" fill="rgba(250,204,21,0.2)"/></svg>',
        };
        const svgContent = svgMap[item.preview] || '<span class="shop-icon-fallback">★</span>';
        previewHTML = `<div class="item-icon-preview">${svgContent}</div>`;
      }

      let actionHTML = '';
      if (isEquipped) {
        actionHTML = '<span class="item-status equipped-badge">✓ KULLANILIYOR</span>';
      } else if (isOwned) {
        actionHTML = '<button class="item-equip-btn" data-id="' + item.id + '">KULLAN</button>';
      } else if (canAfford) {
        actionHTML = '<button class="item-buy-btn" data-id="' + item.id + '">💎 ' + item.price + '</button>';
      } else {
        actionHTML = '<span class="item-status locked-badge">🔒 ' + item.price + ' 💎</span>';
      }

      card.innerHTML = `
        ${previewHTML}
        <div class="item-name">${item.name}</div>
        ${actionHTML}
      `;
      shopGrid.appendChild(card);
    });

    // Event handlers
    shopGrid.querySelectorAll('.item-buy-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        if (this.buy(id)) {
          this.equip(this.currentCategory, id);
          this.renderShop();
          vibrate(20);
        }
      });
    });

    shopGrid.querySelectorAll('.item-equip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        this.equip(this.currentCategory, id);
        this.renderShop();
        vibrate(12);
      });
    });
  }
}

const shop = new ShopSystem();

// ==========================================
// İZ BIRAKMA SİSTEMİ (TRAIL SYSTEM)
// ==========================================
class TrailSystem {
  constructor() {
    this.trails = []; // { x, y, color, size, life, maxLife, style }
    this.dropTimer = 0;
    this.colorCycleTime = 0;
  }

  reset() {
    this.trails = [];
    this.dropTimer = 0;
    this.colorCycleTime = 0;
  }

  getTrailColor() {
    // Zıt renk mantığı: mevcut karakter rengine göre zıt iz bırakır
    this.colorCycleTime += 0.02;
    const t = this.colorCycleTime;

    // 3 neon renk arasında döngüsel geçiş
    const colors = ['#ff007f', '#00f0ff', '#ffe600'];
    const idx = Math.floor(t * 1.5) % colors.length;
    return colors[idx];
  }

  dropTrail(x, y, isMoving) {
    this.dropTimer++;
    const freq = isMoving ? 4 : 10; // Hareket halindeyken daha sık iz

    if (this.dropTimer % freq !== 0) return;

    const trailItem = shop.getEquippedItem('trailStyle');
    const color = this.getTrailColor();
    const size = 4 + Math.random() * 2.5;

    this.trails.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y,
      color: color,
      size: size,
      life: 30,
      maxLife: 30,
      style: trailItem.preview,
    });

    // Maksimum iz sayısı (Ultra hafif - 30 iz)
    if (this.trails.length > 30) {
      this.trails.splice(0, this.trails.length - 30);
    }
  }

  update() {
    for (let i = this.trails.length - 1; i >= 0; i--) {
      this.trails[i].life--;
      if (this.trails[i].life <= 0) {
        this.trails.splice(i, 1);
      }
    }
  }

  draw(ctx, camY) {
    for (const t of this.trails) {
      const screenY = (t.y - camY) * scaleRatio;
      if (screenY < -20 || screenY > canvas.height + 20) continue;

      const alpha = Math.max(0, (t.life / t.maxLife) * 0.7);
      const sx = t.x * scaleRatio;
      const sy = screenY;
      const sz = t.size * scaleRatio;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = t.color;

      switch (t.style) {
        case 'star':
          this.drawStar(ctx, sx, sy, sz);
          break;
        case 'heart':
          this.drawHeart(ctx, sx, sy, sz);
          break;
        case 'flame':
          this.drawFlame(ctx, sx, sy, sz);
          break;
        case 'bubble':
          this.drawBubble(ctx, sx, sy, sz);
          break;
        case 'lightning':
          this.drawLightning(ctx, sx, sy, sz);
          break;
        default: // drop
          ctx.beginPath();
          ctx.arc(sx, sy, sz, 0, Math.PI * 2);
          ctx.fill();
          break;
      }

      ctx.restore();
    }
  }

  drawStar(ctx, x, y, size) {
    const spikes = 5;
    const outerR = size;
    const innerR = size * 0.45;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  drawHeart(ctx, x, y, size) {
    const s = size * 0.7;
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.3);
    ctx.bezierCurveTo(x, y - s * 0.3, x - s, y - s * 0.3, x - s, y + s * 0.1);
    ctx.bezierCurveTo(x - s, y + s * 0.6, x, y + s, x, y + s);
    ctx.bezierCurveTo(x, y + s, x + s, y + s * 0.6, x + s, y + s * 0.1);
    ctx.bezierCurveTo(x + s, y - s * 0.3, x, y - s * 0.3, x, y + s * 0.3);
    ctx.fill();
  }

  drawFlame(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size * 0.5, y - size * 0.5, x + size * 0.8, y, x + size * 0.3, y + size * 0.5);
    ctx.bezierCurveTo(x + size * 0.1, y + size, x - size * 0.1, y + size, x - size * 0.3, y + size * 0.5);
    ctx.bezierCurveTo(x - size * 0.8, y, x - size * 0.5, y - size * 0.5, x, y - size);
    ctx.fill();
  }

  drawBubble(ctx, x, y, size) {
    ctx.lineWidth = 1.5 * scaleRatio;
    ctx.strokeStyle = ctx.fillStyle;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.stroke();
    // Baloncuk ışıltı noktası
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - size * 0.35, y - size * 0.35, size * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLightning(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x - size * 0.5, y);
    ctx.lineTo(x + size * 0.2, y);
    ctx.lineTo(x - size * 0.2, y + size);
    ctx.lineTo(x + size * 0.6, y - size * 0.2);
    ctx.lineTo(x, y - size * 0.2);
    ctx.closePath();
    ctx.fill();
  }
}

const trailSystem = new TrailSystem();

// ==========================================
// VİRTUAL ÇÖZÜNÜRLÜK & CANVAS
// ==========================================
const VIRTUAL_WIDTH = 480;
const VIRTUAL_HEIGHT = 740;
let scaleRatio = 1;

function resizeCanvas() {
  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  scaleRatio = canvas.width / VIRTUAL_WIDTH;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==========================================
// PARÇACIK VE GÖRSEL METİNLER
// ==========================================
class Particle {
  constructor(x, y, vx, vy, color, size, life) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx, camY) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x * scaleRatio, (this.y - camY) * scaleRatio, this.size * scaleRatio, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FloatingText {
  constructor(text, x, y, color) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.life = 45;
    this.maxLife = 45;
  }

  update() {
    this.y -= 1.6;
    this.life--;
  }

  draw(ctx, camY) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `800 ${22 * scaleRatio}px Trebuchet MS, sans-serif`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 3 * scaleRatio;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.strokeText(this.text, this.x * scaleRatio, (this.y - camY) * scaleRatio);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x * scaleRatio, (this.y - camY) * scaleRatio);
    ctx.restore();
  }
}

// ==========================================
// OYUN DURUMU & OYUNCU (PLAYER)
// ==========================================
const GAME_STATE = {
  START: 0,
  PLAYING: 1,
  PAUSED: 2
};

let currentState = GAME_STATE.START;
let bestScore = parseInt(localStorage.getItem('towerkick_best') || '0', 10);
bestValEl.textContent = bestScore;

let cameraY = 0;
let cameraTargetY = 0;
let screenShake = 0;
let gameTime = 0; // Global zaman sayacı (renk döngüsü için)

// Yükselen Lav & Göz Koruma Durumları
let lavaY = 1100;
let lavaSpeed = 0.3;
let lavaWaveOffset = 0;
let isDeadByLava = false;

let comfortMode = localStorage.getItem('towerkick_comfort') === '1';
if (comfortMode) {
  document.body.classList.add('comfort-mode');
  if (comfortBtn) comfortBtn.textContent = '☀️';
} else {
  if (comfortBtn) comfortBtn.textContent = '🌙';
}

// İki Başparmak Girdileri
let inputLeft = false;
let inputRight = false;

const player = {
  x: VIRTUAL_WIDTH / 2 - 16,
  y: 650,
  width: 32,
  height: 38,
  vx: 0,
  vy: 0,
  maxSpeed: 6.8,
  accel: 0.72,
  friction: 0.88,
  isGrounded: false,
  coyoteTimer: 0,
  scaleX: 1,
  scaleY: 1,
  rotation: 0,
  comboCount: 0,
  comboTimer: 0,
  maxComboTimer: 110,
  highestFloor: 0,
  lastWallKickDir: 0,
  wallKickCount: 0,
  hasDoubleJump: false,
  wallContactFrames: 0,
  wallWarnShown: false,
  onIce: false,
  iceHopTimer: 0,
  wallKickLockTimer: 0,
  airWallKicks: 0,

  reset(startY = 650) {
    this.x = VIRTUAL_WIDTH / 2 - 16;
    this.y = startY;
    this.vx = 0;
    this.vy = 0;
    this.isGrounded = false;
    this.coyoteTimer = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.comboCount = 0;
    this.comboTimer = 0;
    this.highestFloor = 0;
    this.currentFloor = 0;
    this.lastWallKickDir = 0;
    this.wallKickCount = 0;
    this.hasDoubleJump = false;
    this.wallContactFrames = 0;
    this.wallWarnShown = false;
    this.onIce = false;
    this.iceHopTimer = 0;
    this.wallKickLockTimer = 0;
    this.airWallKicks = 0;
  }
};

// ==========================================
// OYUN MODLARI VE BÖLÜM (LEVELS) SİSTEMİ
// ==========================================
const GAME_MODES = {
  LAVA: 'lava',
  CLASSIC: 'classic',
  LEVELS: 'levels',
  TIME_ATTACK: 'time_attack',
  HELL: 'hell'
};
let selectedMode = localStorage.getItem('towerkick_mode') || GAME_MODES.LAVA;
let timeAttackSeconds = 60;
let timeAttackTimer = 0;

function isIceWorld() {
  return typeof BIOMES !== 'undefined' && BIOMES && getCurrentBiome().theme === 'ice';
}

function applySpeedSetting() {
  applyRunSpeed();
}

function applyRunSpeed() {
  const floor = player.highestFloor || 0;
  const ramp = Math.min(floor / 140, 1);
  const fast = speedSetting === 'fast';
  const baseMax = fast ? 5.6 : 4.6;
  const baseAcc = fast ? 0.50 : 0.38;
  player.maxSpeed = baseMax + ramp * 2.2;
  player.accel = baseAcc + ramp * 0.26;
  const gripped = activePowerUp && activePowerUp.type === 'grip';
  if ((isIceWorld() || player.onIce) && !gripped) {
    player.friction = 0.994;
    player.maxSpeed += 0.8;
  } else {
    player.friction = 0.90;
  }
}

const STAGES = Array.from({ length: 40 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: `BÖLÜM ${id}`,
    targetFloor: 22 + i * 9,
    reward: 18 + id * 3,
    desc: id < 10 ? 'Lav yok, ritmi öğren.' : (id < 30 ? 'Lav yükseliyor.' : 'Lav hızlı + deprem!')
  };
});
let lastPlatX = VIRTUAL_WIDTH / 2;
let quakeTimer = 0;
let currentLevelId = 1;
let levelData = {};
try {
  levelData = JSON.parse(localStorage.getItem('towerkick_levels') || '{}');
} catch (e) {
  levelData = {};
}

function renderLevels() {
  if (!levelsGrid) return;
  levelsGrid.innerHTML = '';
  STAGES.forEach((st, idx) => {
    const isUnlocked = idx === 0 || (levelData[st.id - 1] && levelData[st.id - 1].completed);
    const info = levelData[st.id] || { completed: false, stars: 0 };
    const card = document.createElement('div');
    card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${info.completed ? 'completed' : ''}`;
    
    let starsStr = '☆☆☆';
    if (info.stars === 1) starsStr = '★☆☆';
    else if (info.stars === 2) starsStr = '★★☆';
    else if (info.stars >= 3) starsStr = '★★★';

    card.innerHTML = `
      <div class="level-number">${isUnlocked ? st.id : '🔒'}</div>
      <div class="level-stars">${isUnlocked ? starsStr : 'KİLİTLİ'}</div>
      <div class="level-target">Kat ${st.targetFloor}</div>
    `;

    if (isUnlocked) {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        startLevel(st.id);
      });
    }
    levelsGrid.appendChild(card);
  });
}

function openLevels() {
  renderLevels();
  if (levelsOverlay) levelsOverlay.classList.remove('hidden');
}

function closeLevels() {
  if (levelsOverlay) levelsOverlay.classList.add('hidden');
}

function startLevel(stageId) {
  currentLevelId = stageId;
  selectedMode = GAME_MODES.LEVELS;
  localStorage.setItem('towerkick_mode', selectedMode);
  modeButtons.forEach(b => {
    b.classList.toggle('active', b.dataset.mode === 'levels');
  });
  closeLevels();
  if (startOverlay) startOverlay.classList.add('hidden');
  startGame();
}

function triggerLevelClear() {
  if (currentState !== GAME_STATE.PLAYING) return;
  currentState = GAME_STATE.PAUSED;
  sounds.stopBGM();
  sounds.purchase();
  shake(14);
  vibrate([50, 60, 70, 80]);

  const stage = STAGES.find(s => s.id === currentLevelId) || STAGES[0];
  const reward = stage.reward;
  shop.addCoins(reward);

  levelData[currentLevelId] = { completed: true, stars: 3 };
  localStorage.setItem('towerkick_levels', JSON.stringify(levelData));

  if (levelClearText) {
    levelClearText.textContent = `${stage.name} Geçildi! +${reward} 💎 Kazandın!`;
  }
  if (nextLevelBtn) {
    const hasNext = STAGES.some(s => s.id === currentLevelId + 1);
    nextLevelBtn.style.display = hasNext ? 'block' : 'none';
  }
  if (levelClearOverlay) levelClearOverlay.classList.remove('hidden');
}

// ==========================================
// BİYOM: Normal → Neon → Buzul → Magma → Uzay
// ==========================================
const BIOMES = [
  {
    minFloor: 0,
    name: 'TAŞ KULE',
    icon: '🪨',
    theme: 'plain',
    bg: '#0c141c',
    bg2: '#1a2836',
    bg3: '#243646',
    grid: 'rgba(160, 190, 210, 0.10)',
    wall: '#8aa4b8',
    wallDark: '#1c2a36',
    hazardTop: '#ff3700',
    hazardBot: '#550000',
    hazardLine: '#ffe600',
    particle: '#c5d8e6',
    dangerText: '🔥 LAV YÜKSELİYOR!'
  },
  {
    minFloor: 35,
    name: 'SİBER NEON ŞEHRİ',
    icon: '🌆',
    theme: 'neon',
    bg: '#0a0614',
    bg2: '#1a0830',
    bg3: '#2a1050',
    grid: 'rgba(255, 0, 200, 0.16)',
    wall: '#ff00d4',
    wallDark: '#2a0040',
    hazardTop: '#d900ff',
    hazardBot: '#1a0030',
    hazardLine: '#00f0ff',
    particle: '#ff007f',
    dangerText: '⚡ NEON ASİT YÜKSELİYOR!'
  },
  {
    minFloor: 70,
    name: 'BUZUL ŞELALESİ',
    icon: '❄️',
    theme: 'ice',
    bg: '#071820',
    bg2: '#0c3044',
    bg3: '#15485c',
    grid: 'rgba(160, 230, 255, 0.14)',
    wall: '#9ae6ff',
    wallDark: '#0d3a55',
    hazardTop: '#9ae6ff',
    hazardBot: '#024a6e',
    hazardLine: '#ffffff',
    particle: '#dffffa',
    dangerText: '🌊 BUZLU SU YÜKSELİYOR!'
  },
  {
    minFloor: 110,
    name: 'MAGMA MAĞARASI',
    icon: '🌋',
    theme: 'magma',
    bg: '#1a0804',
    bg2: '#3a1208',
    bg3: '#5a1c0c',
    grid: 'rgba(255, 80, 0, 0.18)',
    wall: '#ff4d00',
    wallDark: '#4a1400',
    hazardTop: '#ff3700',
    hazardBot: '#550000',
    hazardLine: '#ffe600',
    particle: '#ff4400',
    dangerText: '🔥 LAV YÜKSELİYOR!'
  },
  {
    minFloor: 155,
    name: 'DERİN KOZMİK UZAY',
    icon: '🌌',
    theme: 'space',
    bg: '#02040c',
    bg2: '#0a1028',
    bg3: '#12183a',
    grid: 'rgba(255, 230, 120, 0.12)',
    wall: '#ffe600',
    wallDark: '#1a1600',
    hazardTop: '#7c5cff',
    hazardBot: '#120028',
    hazardLine: '#ffffff',
    bg3: '#12183a',
    particle: '#ffffff',
    dangerText: '🌌 BOŞLUK YAKLAŞIYOR!'
  }
];
let currentBiomeIndex = 0;

function getBiomeIndexForFloor(floor) {
  let idx = 0;
  for (let i = 0; i < BIOMES.length; i++) {
    if (floor >= BIOMES[i].minFloor) idx = i;
  }
  return idx;
}

function getCurrentBiome() {
  return BIOMES[currentBiomeIndex] || BIOMES[0];
}

function biomeAtFloor(floor) {
  return BIOMES[getBiomeIndexForFloor(floor)] || BIOMES[0];
}

function checkBiomeProgression(floor) {
  const target = getBiomeIndexForFloor(floor);
  if (target > currentBiomeIndex) {
    currentBiomeIndex = target;
    showBiomeBanner(BIOMES[currentBiomeIndex]);
    sounds.playBiomeSting(BIOMES[currentBiomeIndex].theme);
    sounds.purchase();
    shake(8);
    vibrate([40, 50, 60]);
  }
}

function showBiomeBanner(biome) {
  biomeHoldTimer = 0; // ASLA OYUNU DONDURMA: Akıcı ve kesintisiz geçiş
  if (biomeBannerEl) {
    if (biomeIconEl) biomeIconEl.textContent = biome.icon;
    if (biomeNameEl) biomeNameEl.textContent = biome.name;
    biomeBannerEl.classList.add('big-reveal');
    biomeBannerEl.classList.remove('hidden');
    setTimeout(() => {
      biomeBannerEl.classList.add('hidden');
      biomeBannerEl.classList.remove('big-reveal');
    }, 2400);
  }
  floatingTexts.push(new FloatingText(`${biome.icon} ${biome.name}`, VIRTUAL_WIDTH / 2, player.y - 50, biome.particle || '#ffe600'));
}

/** Retro pixel helper: snap + fill rect in virtual coords */
function pxFill(x, y, w, h, color) {
  ctx.fillStyle = color;
  const s = scaleRatio;
  ctx.fillRect(Math.floor(x * s), Math.floor(y * s), Math.max(1, Math.floor(w * s)), Math.max(1, Math.floor(h * s)));
}

// ==========================================
// GÜÇLENDİRİCİLER (POWER-UPS)
// ==========================================
const POWER_UP_TYPES = {
  MAGNET: 'magnet',
  SHIELD: 'shield',
  FREEZE: 'freeze',
  JETPACK: 'jetpack',
  EMBER: 'ember',
  GRIP: 'grip',
  GLITCH: 'glitch',
  STAR: 'star'
};

const POWER_UP_DATA = {
  magnet: { name: 'ELMAS MIKNATISI', icon: '🧲', color: '#00f0ff', duration: 360 },
  shield: { name: 'LAV KALKANI', icon: '🛡️', color: '#ff007f', duration: 999999 },
  freeze: { name: 'LAV DONDURUCU', icon: '❄️', color: '#a5f3fc', duration: 300 },
  jetpack: { name: 'SÜPER ROKET', icon: '🚀', color: '#ffe600', duration: 210 },
  ember: { name: 'KOR İTMESİ', icon: '🔥', color: '#ff6a00', duration: 1 },
  grip: { name: 'BUZ TUTUŞU', icon: '🧤', color: '#9ae6ff', duration: 360 },
  glitch: { name: 'NEON GLITCH', icon: '💠', color: '#ff00d4', duration: 300 },
  star: { name: 'YILDIZ DÜŞÜŞÜ', icon: '⭐', color: '#ffe600', duration: 300 }
};

let powerUps = [];
let activePowerUp = null;

function pickRandomPowerUp() {
  const theme = isIceWorld() ? 'ice' : (getCurrentBiome().theme || 'magma');
  const byTheme = {
    magma: [POWER_UP_TYPES.SHIELD, POWER_UP_TYPES.EMBER, POWER_UP_TYPES.FREEZE],
    ice: [POWER_UP_TYPES.GRIP, POWER_UP_TYPES.MAGNET, POWER_UP_TYPES.FREEZE],
    neon: [POWER_UP_TYPES.GLITCH, POWER_UP_TYPES.JETPACK, POWER_UP_TYPES.MAGNET],
    space: [POWER_UP_TYPES.STAR, POWER_UP_TYPES.SHIELD, POWER_UP_TYPES.JETPACK]
  };
  const pool = byTheme[theme] || byTheme.magma;
  return pool[Math.floor(Math.random() * pool.length)];
}

function playJumpFx(boosted) {
  const theme = getCurrentBiome().theme;
  const cx = player.x + player.width / 2;
  const cy = player.y + player.height;
  sounds.jump(boosted);
  vibrate(boosted ? 18 : 10);
  if (theme === 'neon') {
    emitParticles(cx, cy, 10, '#ff00d4', 6);
    emitParticles(cx, cy, 8, '#00f0ff', 5);
    player.scaleX = 0.45;
    player.scaleY = 1.55;
    if (activePowerUp && activePowerUp.type === 'glitch') {
      player.y -= 18;
      player.vy -= 2.2;
    }
  } else if (theme === 'ice') {
    emitParticles(cx, cy, 8, '#c8f4ff', 3);
    player.scaleX = 0.8;
    player.scaleY = 1.25;
  } else if (theme === 'space') {
    emitParticles(cx, cy, 7, '#ffe600', 2.5);
    player.scaleX = 0.85;
    player.scaleY = 1.2;
  } else {
    emitParticles(cx, cy, boosted ? 8 : 4, boosted ? '#ff6a00' : '#ffffff', boosted ? 4 : 2);
    player.scaleX = 0.7;
    player.scaleY = 1.4;
  }
}

function updateActivePowerUpUI() {
  if (!activePowerUpEl) return;
  if (activePowerUp) {
    activePowerUpEl.classList.remove('hidden');
    const data = POWER_UP_DATA[activePowerUp.type];
    if (powerUpIconEl) powerUpIconEl.textContent = data.icon;
    if (powerUpNameEl) powerUpNameEl.textContent = data.name;
    if (powerUpBarEl) {
      const pct = Math.max(0, (activePowerUp.timer / activePowerUp.maxTimer) * 100);
      powerUpBarEl.style.width = pct + '%';
    }
    if (powerUpTimeEl) {
      powerUpTimeEl.textContent = activePowerUp.type === 'shield' ? '1x' : Math.ceil(activePowerUp.timer / 60) + 's';
    }
  } else {
    activePowerUpEl.classList.add('hidden');
  }
}

// ==========================================
// UÇAN CANAVARLAR (FLYING HAZARDS)
// ==========================================
class FlyingEnemy {
  constructor(floor, y) {
    this.floor = floor;
    this.x = Math.random() * (VIRTUAL_WIDTH - 80) + 40;
    this.y = y;
    this.width = 28;
    this.height = 20;
    this.vx = (Math.random() > 0.5 ? 1.5 : -1.5);
    this.squashed = false;
    this.squashTimer = 0;
    this.wingPhase = Math.random() * Math.PI * 2;
  }

  update() {
    if (this.squashed) {
      this.squashTimer--;
      return;
    }
    this.x += this.vx;
    if (this.x < 22) {
      this.x = 22;
      this.vx *= -1;
    } else if (this.x > VIRTUAL_WIDTH - 22 - this.width) {
      this.x = VIRTUAL_WIDTH - 22 - this.width;
      this.vx *= -1;
    }
    this.wingPhase += 0.25;
  }

  draw(ctx, camY) {
    const sx = this.x * scaleRatio;
    const sy = (this.y - camY) * scaleRatio;
    if (sy < -40 || sy > canvas.height + 40) return;

    ctx.save();
    ctx.translate(sx + (this.width * scaleRatio) / 2, sy + (this.height * scaleRatio) / 2);

    if (this.squashed) {
      ctx.scale(1.4, 0.35);
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14 * scaleRatio, 8 * scaleRatio, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const wingFlap = Math.sin(this.wingPhase) * 0.45;
      // Kanatlar
      ctx.fillStyle = '#9d00ff';
      // Sol kanat
      ctx.beginPath();
      ctx.moveTo(-6 * scaleRatio, 0);
      ctx.lineTo(-18 * scaleRatio, wingFlap * 16 * scaleRatio);
      ctx.lineTo(-8 * scaleRatio, 8 * scaleRatio);
      ctx.closePath();
      ctx.fill();
      // Sağ kanat
      ctx.beginPath();
      ctx.moveTo(6 * scaleRatio, 0);
      ctx.lineTo(18 * scaleRatio, wingFlap * 16 * scaleRatio);
      ctx.lineTo(8 * scaleRatio, 8 * scaleRatio);
      ctx.closePath();
      ctx.fill();

      // Gövde (Mini Mor Yaratık / Yarasa)
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.arc(0, 0, 10 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();

      // Gözler
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-3.5 * scaleRatio, -2 * scaleRatio, 3 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(3.5 * scaleRatio, -2 * scaleRatio, 3 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-3.5 * scaleRatio, -2 * scaleRatio, 1.5 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(3.5 * scaleRatio, -2 * scaleRatio, 1.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

let flyingEnemies = [];

// ==========================================
// MİNİ-BOSS / ELEBAŞI SAVAŞLARI (BOSS ENCOUNTERS)
// ==========================================
class BossEnemy {
  constructor(floor, y, isFinal = false) {
    this.floor = floor;
    this.x = VIRTUAL_WIDTH / 2 - 36;
    this.y = y;
    this.width = 76;
    this.height = 42;
    this.baseSpeed = isFinal ? 2.6 : 1.9;
    this.vx = this.baseSpeed;
    this.maxHp = isFinal ? 4 : 3;
    this.hp = this.maxHp;
    this.isFinal = isFinal;
    this.name = isFinal ? "TITAN CYBORG" : "MECHA GUARDIAN";
    this.defeated = false;
    this.defeatTimer = 0;
    this.flashTimer = 0;
    this.walkPhase = 0;
    
    // Boss mekanikleri: Uyarı, saldırı şarjı ve şok dalgası
    this.attackTimer = 0;
    this.attackCooldown = 180; // ~3 saniyede bir özel saldırı modu
    this.isTelegraphing = false;
    this.isCharging = false;
    this.telegraphTimer = 0;
  }

  update() {
    if (this.defeated) {
      this.defeatTimer--;
      return;
    }
    if (this.flashTimer > 0) this.flashTimer--;

    this.attackTimer++;
    if (!this.isTelegraphing && !this.isCharging && this.attackTimer >= this.attackCooldown) {
      this.isTelegraphing = true;
      this.telegraphTimer = 45; // 0.75 saniye kırmızı lazer uyarısı
      this.attackTimer = 0;
      shake(3);
      vibrate(15);
    }

    if (this.isTelegraphing) {
      this.telegraphTimer--;
      if (this.telegraphTimer <= 0) {
        this.isTelegraphing = false;
        this.isCharging = true;
        this.chargeTimer = 40; // Hızlı depar
        this.vx = (this.vx > 0 ? 1 : -1) * (this.baseSpeed * 2.5);
        shake(6);
        vibrate([20, 20]);
      }
    } else if (this.isCharging) {
      this.chargeTimer--;
      if (this.chargeTimer <= 0) {
        this.isCharging = false;
        this.vx = (this.vx > 0 ? 1 : -1) * this.baseSpeed;
      }
    }

    this.x += this.vx;
    if (this.x < 20) {
      this.x = 20;
      this.vx = Math.abs(this.vx);
    } else if (this.x > VIRTUAL_WIDTH - 20 - this.width) {
      this.x = VIRTUAL_WIDTH - 20 - this.width;
      this.vx = -Math.abs(this.vx);
    }
    this.walkPhase += 0.2;
  }

  draw(ctx, camY) {
    const sx = this.x * scaleRatio;
    const sy = (this.y - camY) * scaleRatio;
    if (sy < -80 || sy > canvas.height + 80) return;

    ctx.save();
    ctx.translate(sx + (this.width * scaleRatio) / 2, sy + (this.height * scaleRatio) / 2);

    if (this.defeated) {
      ctx.globalAlpha = Math.max(0, this.defeatTimer / 30);
      ctx.scale(1.2, 0.4);
      ctx.fillStyle = '#ff0055';
      ctx.fillRect(-this.width * 0.5 * scaleRatio, -this.height * 0.5 * scaleRatio, this.width * scaleRatio, this.height * scaleRatio);
      ctx.restore();
      return;
    }

    const isFlashing = this.flashTimer > 0 && Math.floor(this.flashTimer / 2) % 2 === 0;

    // Lazer / Şarj Uyarısı Telegrafi (Telegraph Beam)
    if (this.isTelegraphing) {
      ctx.save();
      ctx.strokeStyle = Math.floor(Date.now() / 60) % 2 === 0 ? 'rgba(255, 0, 80, 0.9)' : 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3 * scaleRatio;
      ctx.setLineDash([6 * scaleRatio, 4 * scaleRatio]);
      const beamDir = this.vx > 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(beamDir * 180 * scaleRatio, 0);
      ctx.stroke();
      ctx.restore();
    }

    // HP Bar ve Canavar İsmi
    const hpBarW = 64 * scaleRatio;
    const hpBarH = 7 * scaleRatio;
    const hpBarY = -this.height * 0.65 * scaleRatio - 14 * scaleRatio;
    
    // HP Arka Plan
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.roundRect(-hpBarW / 2 - 2 * scaleRatio, hpBarY - 2 * scaleRatio, hpBarW + 4 * scaleRatio, hpBarH + 4 * scaleRatio, 3 * scaleRatio);
    ctx.fill();

    // HP Doluluk
    ctx.fillStyle = this.hp === 1 ? '#ff0033' : (this.isFinal ? '#ff007f' : '#00ffaa');
    const hpFill = Math.max(0, (this.hp / this.maxHp) * hpBarW);
    ctx.fillRect(-hpBarW / 2, hpBarY, hpFill, hpBarH);

    ctx.font = `900 ${11 * scaleRatio}px Trebuchet MS, sans-serif`;
    ctx.fillStyle = this.isCharging ? '#ff0033' : '#ffe600';
    ctx.textAlign = 'center';
    const tag = this.isCharging ? '⚡ ŞARJ SALDIRISI! ⚡' : `${this.name} (${this.hp}/${this.maxHp})`;
    ctx.fillText(tag, 0, hpBarY - 5 * scaleRatio);

    // Robot Gövdesi (Mech Body)
    const w = this.width * scaleRatio;
    const h = this.height * scaleRatio;
    const halfW = w / 2;
    const halfH = h / 2;

    ctx.fillStyle = isFlashing ? '#ffffff' : (this.isFinal ? '#2e1065' : (this.isCharging ? '#450a0a' : '#1e293b'));
    ctx.strokeStyle = this.isCharging ? '#ff0033' : (this.isFinal ? '#ff007f' : '#00f0ff');
    ctx.lineWidth = (this.isCharging ? 3.5 : 2.5) * scaleRatio;

    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, w, h, 6 * scaleRatio);
    ctx.fill();
    ctx.stroke();

    // Lazer Vizör (Glowing eye visor)
    ctx.fillStyle = this.isCharging ? '#ffea00' : (this.isFinal ? '#ff0055' : '#00f0ff');
    ctx.fillRect(-halfW * 0.65, -halfH * 0.25, w * 0.65, 7 * scaleRatio);

    // Yan Omuzluklar & Zırh
    ctx.fillStyle = this.isFinal ? '#ff007f' : '#ffaa00';
    ctx.fillRect(-halfW - 4 * scaleRatio, -halfH * 0.35, 6 * scaleRatio, 12 * scaleRatio);
    ctx.fillRect(halfW - 2 * scaleRatio, -halfH * 0.35, 6 * scaleRatio, 12 * scaleRatio);

    ctx.restore();
  }
}

let bossEnemies = [];

// ==========================================
// GİZEMLİ ŞANS KUTULARI (MYSTERY LUCKY CRATES)
// ==========================================
class MysteryCrate {
  constructor(floor, y) {
    this.floor = floor;
    this.x = Math.random() * (VIRTUAL_WIDTH - 120) + 40;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.broken = false;
    this.pulse = Math.random() * Math.PI * 2;
  }

  update() {
    this.pulse += 0.06;
  }

  draw(ctx, camY) {
    if (this.broken) return;
    const sx = this.x * scaleRatio;
    const sy = (this.y - camY + Math.sin(this.pulse) * 4) * scaleRatio;
    if (sy < -40 || sy > canvas.height + 40) return;

    const w = this.width * scaleRatio;
    const h = this.height * scaleRatio;

    ctx.save();
    ctx.translate(sx + w / 2, sy + h / 2);

    // Sandık Gövdesi
    ctx.fillStyle = '#b45309';
    ctx.strokeStyle = '#ffe600';
    ctx.lineWidth = 2.5 * scaleRatio;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 6 * scaleRatio);
    ctx.fill();
    ctx.stroke();

    // Soru İşareti
    ctx.font = `900 ${16 * scaleRatio}px Trebuchet MS, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❓', 0, 1 * scaleRatio);

    ctx.restore();
  }
}

let mysteryCrates = [];

// ==========================================
// FEVER MODU (FRENZY / RUSH SYSTEM)
// ==========================================
function activateFever() {
  isFeverActive = true;
  feverTimer = 300; // 5 saniye
  if (feverOverlay) feverOverlay.classList.remove('hidden');
  sounds.purchase();
  shake(12);
  vibrate([40, 50, 60, 70]);
  floatingTexts.push(new FloatingText("🔥 FEVER MODU! 🔥", VIRTUAL_WIDTH / 2, player.y - 35, '#ff0055'));
}

function deactivateFever() {
  isFeverActive = false;
  feverTimer = 0;
  if (feverOverlay) feverOverlay.classList.add('hidden');
}

// ==========================================
// 7 GÜNLÜK GİRİŞ SERİSİ SİSTEMİ (DAILY STREAK)
// ==========================================
const STREAK_REWARDS = [15, 25, 40, 60, 80, 100, 200];
let streakData = {
  lastDate: '',
  streakDay: 1,
  claimedToday: false
};

function loadStreakData() {
  try {
    const saved = JSON.parse(localStorage.getItem('towerkick_streak') || '{}');
    const today = getTodayString();
    streakData.lastDate = saved.lastDate || '';
    streakData.streakDay = saved.streakDay || 1;
    streakData.claimedToday = (streakData.lastDate === today);

    // Eğer son giriş dün değilse ve bugün de değilse, seri sıfırlanır
    if (streakData.lastDate && streakData.lastDate !== today) {
      const last = new Date(streakData.lastDate).getTime();
      const now = new Date(today).getTime();
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        streakData.streakDay = 1;
        streakData.claimedToday = false;
      }
    }
  } catch (e) {
    streakData = { lastDate: '', streakDay: 1, claimedToday: false };
  }
}

function saveStreakData() {
  localStorage.setItem('towerkick_streak', JSON.stringify(streakData));
}

function renderStreak() {
  if (!streakGrid) return;
  streakGrid.innerHTML = '';
  const currentDay = streakData.streakDay;

  for (let i = 1; i <= 7; i++) {
    const card = document.createElement('div');
    const isPast = i < currentDay || (i === currentDay && streakData.claimedToday);
    const isToday = i === currentDay && !streakData.claimedToday;
    const isDay7 = i === 7;

    card.className = `streak-card ${isDay7 ? 'day-7' : ''} ${isPast ? 'completed' : ''} ${isToday ? 'today' : ''}`;

    const icon = isDay7 ? '👑' : (isPast ? '✓' : '💎');
    const rewardText = isDay7 ? '+200 💎 & KOSTÜM' : `+${STREAK_REWARDS[i - 1]} 💎`;

    card.innerHTML = `
      <span class="streak-day-title">GÜN ${i}</span>
      <span class="streak-icon">${icon}</span>
      <span class="streak-reward-amount">${rewardText}</span>
    `;

    streakGrid.appendChild(card);
  }

  if (claimStreakBtn) {
    if (streakData.claimedToday) {
      claimStreakBtn.disabled = true;
      claimStreakBtn.textContent = 'BUGÜNKÜ ÖDÜL ALINDI ✓';
      claimStreakBtn.classList.remove('pulse');
    } else {
      claimStreakBtn.disabled = false;
      claimStreakBtn.textContent = `GÜN ${currentDay} ÖDÜLÜNÜ AL 🎁`;
      claimStreakBtn.classList.add('pulse');
    }
  }
}

function openStreak() {
  loadStreakData();
  renderStreak();
  if (streakOverlay) streakOverlay.classList.remove('hidden');
}

function closeStreak() {
  if (streakOverlay) streakOverlay.classList.add('hidden');
}

function claimStreakReward() {
  if (streakData.claimedToday) return;
  const today = getTodayString();
  const reward = STREAK_REWARDS[streakData.streakDay - 1];

  shop.addCoins(reward);
  if (streakData.streakDay === 7) {
    shop.owned['char_cosmic'] = true;
    shop.save();
    floatingTexts.push(new FloatingText("EFSANEVİ KOSTÜM AÇILDI! 👑", VIRTUAL_WIDTH / 2, player.y - 45, '#ffe600'));
  }

  streakData.lastDate = today;
  streakData.claimedToday = true;
  if (streakData.streakDay < 7) {
    streakData.streakDay++;
  } else {
    streakData.streakDay = 1;
  }

  saveStreakData();
  sounds.purchase();
  vibrate([40, 50, 60]);
  shake(8);
  renderStreak();
  floatingTexts.push(new FloatingText(`+${reward} 💎 KAZANDIN! 🎉`, VIRTUAL_WIDTH / 2, player.y - 25, '#00ffaa'));
}

// ==========================================
// GÜNLÜK ŞANS ÇARKI (WHEEL OF FORTUNE)
// ==========================================
const WHEEL_PRIZES = [25, 50, 15, 100, 35, 75];
let isWheelSpinning = false;
let wheelRotation = 0;

function getTodayString() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

const GHOST_KEY = 'towerkick_ghost';
const SCORES_KEY = 'towerkick_scores';
const REVIVE_KEY = 'towerkick_revive';
let ghostBest = [];
let ghostLive = [];
let ghostSampleTick = 0;

function loadGhostBest() {
  try {
    const parsed = JSON.parse(localStorage.getItem(GHOST_KEY) || '[]');
    ghostBest = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    ghostBest = [];
  }
}
loadGhostBest();

function resetGhostLive() {
  ghostLive = [];
  ghostSampleTick = 0;
}

function recordGhostSample() {
  if (currentState !== GAME_STATE.PLAYING) return;
  ghostSampleTick++;
  if (ghostSampleTick % 5 !== 0) return;
  ghostLive.push({ x: player.x, y: player.y });
  if (ghostLive.length > 480) ghostLive.shift();
}

function saveGhostIfBest(floor) {
  if (floor < 4 || ghostLive.length < 8) return;
  if (floor < bestScore) return;
  ghostBest = ghostLive.slice();
  try {
    localStorage.setItem(GHOST_KEY, JSON.stringify(ghostBest));
  } catch (e) {}
}

function loadScores() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function recordScore(floor) {
  if (!floor || floor < 1) return;
  const list = loadScores();
  list.push({ floor, at: Date.now() });
  list.sort((a, b) => b.floor - a.floor || a.at - b.at);
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(list.slice(0, 10)));
  } catch (e) {}
}

function renderScores() {
  if (!scoresListEl) return;
  const list = loadScores();
  if (!list.length) {
    scoresListEl.innerHTML = '<li><span class="empty">Henüz skor yok. Bir koşu bitir.</span></li>';
    return;
  }
  scoresListEl.innerHTML = list.map((row, i) => {
    const when = new Date(row.at);
    const date = Number.isNaN(when.getTime()) ? '' : `${when.getDate()}.${when.getMonth() + 1}`;
    return `<li><span class="rank">${i + 1}</span><span>Kat ${row.floor}</span><span>${date}</span></li>`;
  }).join('');
}

function openScores() {
  renderScores();
  if (scoresOverlay) scoresOverlay.classList.remove('hidden');
}

function closeScores() {
  if (scoresOverlay) scoresOverlay.classList.add('hidden');
}

let pendingRunRecord = false;

function finalizeRunRecord() {
  if (!pendingRunRecord) return;
  pendingRunRecord = false;
  recordScore(player.highestFloor);
  saveGhostIfBest(player.highestFloor);
}

function canFreeRevive() {
  return localStorage.getItem(REVIVE_KEY) !== getTodayString();
}

function updateReviveUI() {
  if (!reviveBtn) return;
  const ok = canFreeRevive();
  reviveBtn.classList.toggle('used', !ok);
  reviveBtn.disabled = !ok;
  const headline = reviveBtn.querySelector('.revive-btn-headline');
  const sub = reviveBtn.querySelector('.revive-btn-sub');
  if (ok) {
    if (headline) headline.textContent = 'ÜCRETSİZ DİRİL';
    if (sub) sub.textContent = 'Günde 1 kez · +10 kat roket';
  } else {
    if (headline) headline.textContent = 'DİRİLME KULLANILDI';
    if (sub) sub.textContent = 'Yarın tekrar 1 hak';
  }
}

function updateWheelStatus() {
  const lastSpin = localStorage.getItem('towerkick_last_wheel_spin');
  const today = getTodayString();
  if (lastSpin === today) {
    if (spinBtn) spinBtn.disabled = true;
    if (wheelStatus) wheelStatus.textContent = 'Bugünkü hakkını kullandın! Yarın tekrar gel ⏳';
  } else {
    if (spinBtn) spinBtn.disabled = false;
    if (wheelStatus) wheelStatus.textContent = 'Bugünkü hakkın hazır! Çevir ve kazan 🎁';
  }
}

function openWheel() {
  updateWheelStatus();
  if (wheelOverlay) wheelOverlay.classList.remove('hidden');
}

function closeWheel() {
  if (wheelOverlay) wheelOverlay.classList.add('hidden');
}

function spinWheel() {
  if (isWheelSpinning) return;
  const lastSpin = localStorage.getItem('towerkick_last_wheel_spin');
  const today = getTodayString();
  if (lastSpin === today) {
    floatingTexts.push(new FloatingText("Yarın tekrar gel! ⏳", VIRTUAL_WIDTH / 2, player.y - 20, '#ffaa00'));
    return;
  }

  isWheelSpinning = true;
  if (spinBtn) spinBtn.disabled = true;

  const targetIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
  const prize = WHEEL_PRIZES[targetIndex];

  const sectorAngle = 60;
  const targetAngle = 360 - (targetIndex * sectorAngle + 30);
  const extraRotations = 360 * 5;
  wheelRotation += extraRotations + targetAngle;

  if (wheelDisc) {
    wheelDisc.style.transition = 'transform 3.5s cubic-bezier(0.15, 0.9, 0.2, 1)';
    wheelDisc.style.transform = `rotate(${wheelRotation}deg)`;
  }

  sounds.init();
  let tickCount = 0;
  const tickInterval = setInterval(() => {
    sounds.playTone(800 + Math.random() * 200, 'sine', 0.04, null, 0.08);
    vibrate(10);
    tickCount++;
    if (tickCount >= 18) clearInterval(tickInterval);
  }, 180);

  setTimeout(() => {
    isWheelSpinning = false;
    localStorage.setItem('towerkick_last_wheel_spin', today);
    shop.addCoins(prize);
    sounds.purchase();
    vibrate([40, 50, 60]);
    shake(10);
    if (wheelStatus) {
      wheelStatus.innerHTML = `<span style="color:#ffe600; font-size:15px; font-weight:800;">🎉 TEBRİKLER! +${prize} 💎 KAZANDIN! 🎉</span>`;
    }

    floatingTexts.push(new FloatingText(`+${prize} 💎 KAZANDIN! 🎉`, VIRTUAL_WIDTH / 2, player.y - 30, '#00ffaa'));
    emitParticles(VIRTUAL_WIDTH / 2, player.y, 40, '#ffe600', 8);
    emitParticles(VIRTUAL_WIDTH / 2, player.y, 30, '#00f0ff', 7);
  }, 3600);
}

// ==========================================
// AYARLAR MENÜSÜ & TOGGLELAR (SETTINGS SYSTEM)
// ==========================================
function openSettings() {
  updateSettingsUI();
  if (settingsOverlay) settingsOverlay.classList.remove('hidden');
}

function closeSettings() {
  if (settingsOverlay) settingsOverlay.classList.add('hidden');
}

function updateSettingsUI() {
  if (bgmToggleBtn) {
    bgmToggleBtn.textContent = sounds.bgmEnabled ? 'AÇIK' : 'KAPALI';
    bgmToggleBtn.classList.toggle('active', sounds.bgmEnabled);
  }
  if (sfxToggleBtn) {
    sfxToggleBtn.textContent = sounds.enabled ? 'AÇIK' : 'KAPALI';
    sfxToggleBtn.classList.toggle('active', sounds.enabled);
  }
  if (hapticToggleBtn) {
    hapticToggleBtn.textContent = hapticSetting === 'high' ? 'GÜÇLÜ' : (hapticSetting === 'low' ? 'HAFİF' : 'KAPALI');
    hapticToggleBtn.classList.toggle('active', hapticSetting !== 'off');
  }
  if (speedToggleBtn) {
    speedToggleBtn.textContent = speedSetting === 'fast' ? 'HIZLI' : 'NORMAL';
    speedToggleBtn.classList.toggle('active', speedSetting === 'fast');
  }
  if (lowFxToggleBtn) {
    lowFxToggleBtn.textContent = lowFx ? 'AÇIK' : 'KAPALI';
    lowFxToggleBtn.classList.toggle('active', lowFx);
  }
  applyTouchLayout();
  updateKeybindButtons();
}

function toggleLowFxSetting() {
  lowFx = !lowFx;
  localStorage.setItem('towerkick_lowfx', lowFx ? '1' : '0');
  updateSettingsUI();
  vibrate(18);
}

function updateKeybindButtons() {
  const map = [
    [bindLeftBtn, 'left'],
    [bindRightBtn, 'right'],
    [bindJumpBtn, 'jump'],
    [bindPauseBtn, 'pause']
  ];
  for (const [btn, action] of map) {
    if (!btn) continue;
    const waiting = pendingBindAction === action;
    btn.classList.toggle('listening', waiting);
    btn.textContent = waiting ? '...' : formatKeyCode(keybinds[action]);
  }
}

function startKeybindListen(action) {
  pendingBindAction = action;
  updateKeybindButtons();
  vibrate(12);
}

function finishKeybindListen(code) {
  if (!pendingBindAction) return false;
  if (!code || code === 'Tab') return true;
  // Aynı tuşu başka aksiyondan kaldır
  for (const key of Object.keys(keybinds)) {
    if (keybinds[key] === code) keybinds[key] = '';
  }
  keybinds[pendingBindAction] = code;
  // Boş kalanlara varsayılan geri ver
  for (const key of Object.keys(DEFAULT_KEYBINDS)) {
    if (!keybinds[key]) keybinds[key] = DEFAULT_KEYBINDS[key];
  }
  pendingBindAction = null;
  saveKeybinds();
  updateKeybindButtons();
  vibrate(20);
  return true;
}

function resetKeybinds() {
  keybinds = { ...DEFAULT_KEYBINDS };
  pendingBindAction = null;
  saveKeybinds();
  updateKeybindButtons();
  vibrate(15);
}

function toggleTouchLayout() {
  touchLayoutSwapped = !touchLayoutSwapped;
  localStorage.setItem('towerkick_touch_swap', touchLayoutSwapped ? '1' : '0');
  applyTouchLayout();
  vibrate(15);
}

function toggleBGMSetting() {
  sounds.bgmEnabled = !sounds.bgmEnabled;
  localStorage.setItem('towerkick_bgm', sounds.bgmEnabled ? '1' : '0');
  if (sounds.bgmEnabled && currentState === GAME_STATE.PLAYING) {
    sounds.startBGM();
  } else {
    sounds.stopBGM();
  }
  updateSettingsUI();
  vibrate(15);
}

function toggleSFXSetting() {
  sounds.enabled = !sounds.enabled;
  localStorage.setItem('towerkick_sfx', sounds.enabled ? '1' : '0');
  updateSettingsUI();
  if (soundBtn) soundBtn.textContent = sounds.enabled ? '🔊' : '🔇';
  vibrate(15);
}

function toggleHapticSetting() {
  if (hapticSetting === 'high') hapticSetting = 'low';
  else if (hapticSetting === 'low') hapticSetting = 'off';
  else hapticSetting = 'high';
  localStorage.setItem('towerkick_haptic', hapticSetting);
  updateSettingsUI();
  vibrate(25);
}

function toggleSpeedSetting() {
  speedSetting = speedSetting === 'normal' ? 'fast' : 'normal';
  localStorage.setItem('towerkick_speed', speedSetting);
  applySpeedSetting();
  updateSettingsUI();
  vibrate(20);
}

// ==========================================
// GÖREVLER SİSTEMİ (QUESTS SYSTEM)
// ==========================================
const DEFAULT_QUESTS = [
  { id: 'gems_25', title: '25 Elmas Topla', target: 25, current: 0, reward: 50, claimed: false },
  { id: 'floor_30', title: 'Kat 30\'a Ulaş', target: 30, current: 0, reward: 75, claimed: false },
  { id: 'combo_4', title: '4x Kombo Yap', target: 4, current: 0, reward: 60, claimed: false },
  { id: 'stomp_2', title: '2 Canavar Ez (Stomp)', target: 2, current: 0, reward: 80, claimed: false }
];

let quests = [];
function loadQuests() {
  const saved = localStorage.getItem('towerkick_quests');
  if (saved) {
    try {
      quests = JSON.parse(saved);
    } catch (e) {
      quests = JSON.parse(JSON.stringify(DEFAULT_QUESTS));
    }
  } else {
    quests = JSON.parse(JSON.stringify(DEFAULT_QUESTS));
  }
}

function saveQuests() {
  localStorage.setItem('towerkick_quests', JSON.stringify(quests));
}

function updateQuestProgress(id, amount, isAbsolute = false) {
  const q = quests.find(item => item.id === id);
  if (!q || q.claimed) return;
  if (isAbsolute) {
    if (amount > q.current) q.current = Math.min(amount, q.target);
  } else {
    q.current = Math.min(q.current + amount, q.target);
  }
  saveQuests();
}

function claimQuestReward(id) {
  const q = quests.find(item => item.id === id);
  if (!q || q.current < q.target || q.claimed) return;
  q.claimed = true;
  saveQuests();
  shop.addCoins(q.reward);
  sounds.purchase();
  floatingTexts.push(new FloatingText(`+${q.reward} 💎 KAZANDIN!`, VIRTUAL_WIDTH / 2, player.y - 30, '#00ffaa'));
  renderQuests();
}

function renderQuests() {
  if (!questListEl) return;
  questListEl.innerHTML = '';
  quests.forEach(q => {
    const isReady = q.current >= q.target && !q.claimed;
    const card = document.createElement('div');
    card.className = `quest-card ${q.claimed ? 'completed' : ''}`;
    const pct = Math.min(100, Math.round((q.current / q.target) * 100));

    card.innerHTML = `
      <div class="quest-info">
        <div class="quest-name">${q.title}</div>
        <div class="quest-progress-wrap">
          <div class="quest-progress-fill" style="width: ${pct}%"></div>
        </div>
        <div class="quest-progress-text">${q.current} / ${q.target} (${pct}%)</div>
      </div>
      <div class="quest-action">
        <span class="quest-reward">+${q.reward} 💎</span>
        <button class="quest-claim-btn" ${!isReady ? 'disabled' : ''}>
          ${q.claimed ? 'ALINDI ✓' : (isReady ? 'ÖDÜLÜ AL' : 'DEVAM EDİYOR')}
        </button>
      </div>
    `;

    const btn = card.querySelector('.quest-claim-btn');
    if (isReady && btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        claimQuestReward(q.id);
      });
    }
    questListEl.appendChild(card);
  });
}

function openQuests() {
  loadQuests();
  renderQuests();
  if (questOverlay) questOverlay.classList.remove('hidden');
}

function closeQuests() {
  if (questOverlay) questOverlay.classList.add('hidden');
}

// ==========================================
// PLATFORMLAR & ELMASLAR
// ==========================================
let platforms = [];
let gems = [];
let particles = [];
let floatingTexts = [];

const PLATFORM_TYPES = {
  NORMAL: 0,
  ICE: 1,
  MOVING: 2,
  SPRING: 3,
  BOOST: 4,
  PORTAL: 5,
  WIND: 6,
  BOMB: 7,
  GHOST: 8
};

function platformGap(floor) {
  const theme = biomeAtFloor(floor).theme;
  // Kesinlikle zıplanabilir, akıcı ve ritmik basamak aralıkları
  if (theme === 'ice') return 60 + Math.min(floor * 0.05, 8); // Buz zıplaması yüksek olduğu için ideal mesafe
  if (theme === 'plain') return 68 + Math.min(floor * 0.12, 12);
  return 72 + Math.min(floor * 0.14, 16);
}

function createPlatform(floor, y) {
  const theme = biomeAtFloor(floor).theme;
  const iceBiome = theme === 'ice';
  
  // Platform genişlikleri: Dolgun, sağlam ve zıplaması çok daha tatmin edici arcade blokları (110 - 155px)
  const minWidth = iceBiome ? 120 : 110;
  const maxWidth = iceBiome ? 155 : 145;
  const width = Math.max(minWidth, maxWidth - Math.min(floor * 0.12, 16));
  
  const minX = 24;
  const maxX = VIRTUAL_WIDTH - width - 24;
  let x;
  
  if (floor <= 1) {
    x = VIRTUAL_WIDTH / 2 - width / 2;
  } else {
    // Ritmik ve kestirilebilir parkur: Ardışık basamaklar arasında dengeli zigzag
    const wasLeft = lastPlatX < VIRTUAL_WIDTH / 2;
    // Bazen aynı tarafta kalır (%28), çoğunlukla karşı tarafa doğru akar (%72)
    const switchSide = Math.random() < 0.72;
    const targetLeft = switchSide ? !wasLeft : wasLeft;
    
    if (targetLeft) {
      x = minX + Math.random() * ((VIRTUAL_WIDTH * 0.40) - minX);
    } else {
      x = (VIRTUAL_WIDTH * 0.60) - (width * 0.4) + Math.random() * (maxX - (VIRTUAL_WIDTH * 0.60) + (width * 0.4));
    }
    x = Math.max(minX, Math.min(maxX, x));
  }
  lastPlatX = x;

  let type = PLATFORM_TYPES.NORMAL;
  const rand = Math.random();

  if (iceBiome) {
    if (rand < 0.55) type = PLATFORM_TYPES.ICE;
    else if (rand < 0.70) type = PLATFORM_TYPES.MOVING;
    else if (rand < 0.80) type = PLATFORM_TYPES.SPRING;
  } else if (floor >= 70) {
    if (rand < 0.14) type = PLATFORM_TYPES.SPRING;
    else if (rand < 0.28) type = PLATFORM_TYPES.MOVING;
    else if (rand < 0.36) type = PLATFORM_TYPES.BOOST;
    else if (rand < 0.42) type = PLATFORM_TYPES.PORTAL;
  } else if (floor > 30) {
    if (rand < 0.12) type = PLATFORM_TYPES.SPRING;
    else if (rand < 0.25) type = PLATFORM_TYPES.MOVING;
    else if (rand < 0.32) type = PLATFORM_TYPES.BOOST;
  } else if (floor > 10) {
    if (rand < 0.12) type = PLATFORM_TYPES.SPRING;
    else if (rand < 0.22) type = PLATFORM_TYPES.MOVING;
  } else if (floor > 4 && rand < 0.10) {
    type = PLATFORM_TYPES.SPRING;
  }

  // Elmas Spawn
  let hasGem = false;
  if (Math.random() < 0.35) {
    hasGem = true;
    gems.push({
      floor,
      x: x + width / 2,
      y: y - 28,
      collected: false,
      pulse: Math.random() * Math.PI
    });
  }

  // Güçlendirici (Power-Up) Spawn
  if (!hasGem && Math.random() * 0.12 && floor > 3) {
    powerUps.push({
      floor,
      x: x + width / 2,
      y: y - 28,
      type: pickRandomPowerUp(),
      pulse: Math.random() * Math.PI,
      collected: false
    });
  }

  return {
    floor,
    x,
    y,
    width,
    height: 24,
    type,
    vx: type === PLATFORM_TYPES.MOVING ? (Math.random() > 0.5 ? 2.2 : -2.2) : 0,
    broken: false,
    breakTimer: 0,
    maxBreakTime: 16,
    landed: false,
    armed: false,
    fuse: 0,
    isGhostActive: true
  };
}

function initPlatforms() {
  platforms = [];
  gems = [];
  powerUps = [];
  flyingEnemies = [];
  bossEnemies = [];
  mysteryCrates = [];

  platforms.push({
    floor: 0,
    x: 16,
    y: 700,
    width: VIRTUAL_WIDTH - 32,
    height: 20,
    type: PLATFORM_TYPES.NORMAL,
    vx: 0,
    broken: false,
    isGhostActive: true
  });

  lastPlatX = VIRTUAL_WIDTH / 2;
  let currentY = 600;
  for (let f = 1; f <= 12; f++) {
    platforms.push(createPlatform(f, currentY));
    currentY -= platformGap(f);
  }
}

function generateMorePlatforms() {
  const highestPlatform = platforms[platforms.length - 1];
  if (!highestPlatform) return;

  if (highestPlatform.y > cameraY - 450) {
    let nextY = highestPlatform.y - platformGap(highestPlatform.floor + 1);
    const iceGen = biomeAtFloor(highestPlatform.floor + 1).theme === 'ice';
    const batch = iceGen ? 10 : 6;
    for (let i = 1; i <= batch; i++) {
      const nextFloor = highestPlatform.floor + i;
      platforms.push(createPlatform(nextFloor, nextY));
      nextY -= platformGap(nextFloor);

      // Kat 35'ten sonra basamaklar arası uçan yaratık nadiren (%14 ihtimalle) çıkar
      if (nextFloor > 35 && Math.random() < 0.14) {
        flyingEnemies.push(new FlyingEnemy(nextFloor, nextY + 36));
      }

      // Gizemli Şans Kutuları (Kat 16'dan sonra her 20 katta bir nadiren çıkar)
      if (nextFloor > 15 && nextFloor % 20 === 0 && !mysteryCrates.some(mc => mc.floor === nextFloor)) {
        mysteryCrates.push(new MysteryCrate(nextFloor, nextY + 36));
      }

      // Kat 25, 50, 75 Mini-Boss ve Kat 100 Titan Boss Karşılaşması!
      if (nextFloor === 25 && !bossEnemies.some(b => b.floor === 25)) {
        bossEnemies.push(new BossEnemy(25, nextY - 15, false));
        floatingTexts.push(new FloatingText("⚠️ ELEBAŞI YAKLAŞIYOR!", VIRTUAL_WIDTH / 2, nextY - 50, '#ff0055'));
      } else if (nextFloor === 50 && !bossEnemies.some(b => b.floor === 50)) {
        bossEnemies.push(new BossEnemy(50, nextY - 15, false));
        floatingTexts.push(new FloatingText("⚠️ MEGA MECH YAKLAŞIYOR!", VIRTUAL_WIDTH / 2, nextY - 50, '#ff0055'));
      } else if (nextFloor === 75 && !bossEnemies.some(b => b.floor === 75)) {
        bossEnemies.push(new BossEnemy(75, nextY - 15, false));
        floatingTexts.push(new FloatingText("⚠️ ELEBAŞI YAKLAŞIYOR!", VIRTUAL_WIDTH / 2, nextY - 50, '#ff0055'));
      } else if (nextFloor === 100 && !bossEnemies.some(b => b.floor === 100)) {
        bossEnemies.push(new BossEnemy(100, nextY - 15, true));
        floatingTexts.push(new FloatingText("⚠️ TITAN CYBORG GELİYOR!", VIRTUAL_WIDTH / 2, nextY - 50, '#ff0055'));
      }
    }

    // Temizlik sadece yeni katlar üretildiğinde yapılır:
    // Alt platformlar geniş bir güvenlik tamponuyla (oyuncunun 25 kat gerisine kadar) saklanır.
    // Böylece klasik modda veya düşüşlerde asla boşluğa düşülmez, basamaklar yerinde durur!
    const minSafeFloor = Math.max(0, player.highestFloor - 30);
    platforms = platforms.filter(p => p.floor >= minSafeFloor || p.floor === 0);
    gems = gems.filter(g => (g.floor >= minSafeFloor && !g.collected) || g.floor === 0);
    powerUps = powerUps.filter(pu => (pu.floor >= minSafeFloor && !pu.collected) || pu.floor === 0);
    flyingEnemies = flyingEnemies.filter(fe => (!fe.squashed || fe.squashTimer > 0) && (fe.floor >= minSafeFloor));
    bossEnemies = bossEnemies.filter(b => (!b.defeated || b.defeatTimer > 0) && (b.floor >= minSafeFloor));
    mysteryCrates = mysteryCrates.filter(mc => !mc.broken && (mc.floor >= minSafeFloor));
  }
}

// ==========================================
// KOMBO & EFEKT
// ==========================================
const COMBO_NAMES = [
  "", "GOOD!", "SWEET!", "GREAT!", "SUPER!", "AMAZING!", "INSANE!", "UNSTOPPABLE! 🔥"
];

function addCombo(x, y) {
  player.comboCount++;
  player.comboTimer = player.maxComboTimer;
  sounds.combo(player.comboCount);

  if (player.comboCount >= 5 && !isFeverActive) {
    activateFever();
  }

  const comboName = COMBO_NAMES[Math.min(player.comboCount, COMBO_NAMES.length - 1)];
  floatingTexts.push(new FloatingText(`${comboName} x${player.comboCount}`, x, y - 20, '#ffe600'));

  comboContainer.classList.remove('hidden');
  comboTextEl.textContent = comboName;
  comboMultiplierEl.textContent = `x${player.comboCount} KOMBO`;
}

function shake(amount) {
  if (lowFx) amount *= 0.32;
  screenShake = Math.max(screenShake, amount);
}

function emitParticles(x, y, count, color, speed = 4) {
  const cap = lowFx ? 4 : 12;
  const actualCount = Math.min(count, cap);
  const spdScale = lowFx ? 0.65 : 1;
  for (let i = 0; i < actualCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = (Math.random() * 0.7 + 0.3) * speed * spdScale;
    particles.push(new Particle(
      x, y,
      Math.cos(angle) * spd,
      Math.sin(angle) * spd,
      color,
      Math.random() * 2.5 + 1.5,
      Math.random() * 12 + 10
    ));
  }
  const maxParts = lowFx ? 16 : 45;
  if (particles.length > maxParts) {
    particles.splice(0, particles.length - maxParts);
  }
}

function collectGem(g) {
  if (!g || g.collected) return;
  g.collected = true;
  sounds.gem();
  vibrate(15);
  emitParticles(g.x, g.y, 14, '#00ffaa', 5);
  const baseCoins = Math.max(1, Math.floor((player.currentFloor || 0) / 10) + 1);
  const bonusCoins = baseCoins * (isFeverActive ? 2 : 1);
  shop.addCoins(bonusCoins);
  updateQuestProgress('gems_25', bonusCoins);
  floatingTexts.push(new FloatingText(`+${bonusCoins} 💎${isFeverActive ? ' (x2!)' : ''}`, g.x, g.y, isFeverActive ? '#ffe600' : '#00ffaa'));
  addCombo(g.x, g.y);
}

function collectPowerUp(pu) {
  if (!pu || pu.collected) return;
  pu.collected = true;
  const data = POWER_UP_DATA[pu.type] || { name: 'GÜÇ', icon: '⚡', color: '#00f0ff', duration: 240 };
  if (pu.type === 'ember') {
    lavaY += 90;
    sounds.spring();
    vibrate(24);
    emitParticles(pu.x, pu.y, 16, '#ff6a00', 6);
    floatingTexts.push(new FloatingText('🔥 LAV GERİLEDİ', pu.x, pu.y - 10, '#ff6a00'));
    return;
  }
  activePowerUp = { type: pu.type, timer: data.duration, maxTimer: data.duration };
  updateActivePowerUpUI();
  sounds.purchase();
  vibrate(22);
  emitParticles(pu.x, pu.y, 16, data.color || '#00f0ff', 6);
  floatingTexts.push(new FloatingText(`${data.icon} ${data.name}`, pu.x, pu.y - 10, data.color || '#00f0ff'));
}

function lootBelongsToPlatform(item, plat) {
  if (!item || item.collected || item.broken) return false;
  if (item.floor != null && item.floor === plat.floor) return true;
  const onX = item.x >= plat.x - 12 && item.x <= plat.x + plat.width + 12;
  const onY = Math.abs(item.y - (plat.y - 28)) < 48;
  return onX && onY;
}

function collectLootOnPlatform(plat) {
  for (const g of gems) {
    if (lootBelongsToPlatform(g, plat)) collectGem(g);
  }
  for (const pu of powerUps) {
    if (lootBelongsToPlatform(pu, plat)) collectPowerUp(pu);
  }
  for (const crate of mysteryCrates) {
    const cx = crate.x + crate.width / 2;
    const cy = crate.y + crate.height / 2;
    const fake = { x: cx, y: cy, floor: crate.floor, collected: crate.broken };
    if (lootBelongsToPlatform(fake, plat)) {
      crate.broken = true;
      sounds.purchase();
      shake(8);
      vibrate([30, 20, 30]);
      emitParticles(cx, cy, 20, '#ffe600', 6);
      const roll = Math.random();
      if (roll < 0.45) {
        const jackpot = Math.floor(Math.random() * 20) + 20;
        shop.addCoins(jackpot);
        floatingTexts.push(new FloatingText(`📦 +${jackpot} 💎`, cx, cy - 16, '#00ffaa'));
      } else if (roll < 0.75) {
        activePowerUp = { type: POWER_UP_TYPES.JETPACK, timer: 210, maxTimer: 210 };
        updateActivePowerUpUI();
        floatingTexts.push(new FloatingText('📦 ROKET 🚀', cx, cy - 16, '#ffe600'));
      } else {
        activePowerUp = { type: POWER_UP_TYPES.SHIELD, timer: 999999, maxTimer: 999999 };
        updateActivePowerUpUI();
        floatingTexts.push(new FloatingText('📦 KALKAN 🛡️', cx, cy - 16, '#ff007f'));
      }
    }
  }
}

function performWallKick(dir, manual = false) {
  // dir: -1 sol duvardan sağa doğru, 1 sağ duvardan sola doğru

  // ZORUNLU PLATFORM MEKANİĞİ: Havada maksimum 2 ardışık duvar tekmesi!
  // Oyuncu 3. kez duvara çarparsa duvardan aşağı kayar ve "PLATFORMA BAS!" uyarısı alır.
  if (player.airWallKicks >= 2) {
    if (!player.wallWarnShown) {
      player.wallWarnShown = true;
      sounds.fall();
      shake(comfortMode ? 2 : 4);
      vibrate(25);
      floatingTexts.push(new FloatingText("PLATFORMA BAS! 🪜", player.x + player.width / 2, player.y - 15, '#ff3355'));
    }
    // Duvara sürtünme: dikey hızı yavaşlat ama yukarı fırlatma
    player.vy = Math.max(player.vy, 1.2);
    player.vx = 0;
    return false;
  }

  if (player.lastWallKickDir !== dir) {
    // Farklı duvara geçti
    player.wallKickCount = 0;
  }

  // Duvar tekmesinde grounded durumunu ve buz beklemesini anında kaldır
  player.isGrounded = false;
  player.coyoteTimer = 0;
  player.iceHopTimer = 0;

  const isPerfect = manual && player.wallContactFrames <= 8;
  const kickVyBase = isPerfect ? -17.5 : -16.0;
  const kickVy = isIceWorld() ? kickVyBase * 1.25 : kickVyBase;
  // Yatay fırlatma dengeli ve kontrollü (artık aşırı savurmaz):
  const kickVx = isPerfect ? (dir === -1 ? 5.4 : -5.4) : (dir === -1 ? 4.8 : -4.8);

  player.airWallKicks++;
  player.wallKickCount++;
  player.lastWallKickDir = dir;
  player.vx = kickVx;
  player.vy = kickVy;
  player.rotation = dir === -1 ? 360 : -360;
  player.scaleX = 0.55;
  player.scaleY = 1.5;
  player.wallKickLockTimer = 5; // Kısa kilitleme: oyuncu havada yön kontrolünü anında geri kazanır
  
  // Duvara yapışmayı önlemek için içeri it
  const leftBorder = 16;
  const rightBorder = VIRTUAL_WIDTH - 16 - player.width;
  if (dir === -1) {
    player.x = Math.max(player.x, leftBorder + 8);
  } else {
    player.x = Math.min(player.x, rightBorder - 8);
  }

  sounds.wallKick();
  shake(comfortMode ? 3 : 6);
  vibrate([25, 30]);

  if (isPerfect) {
    sounds.playTone(520, 'sawtooth', 0.22, 1200, 0.35);
    floatingTexts.push(new FloatingText("⚡ PERFECT KICK! ⚡", player.x + player.width / 2, player.y - 15, '#ffe600'));
    shop.addCoins(1);
  } else {
    floatingTexts.push(new FloatingText("WALL KICK! ⚡", player.x + player.width / 2, player.y - 15, '#00f0ff'));
  }

  if (dir === -1) {
    emitParticles(player.x, player.y + player.height / 2, 16, '#00f0ff', 6);
  } else {
    emitParticles(player.x + player.width, player.y + player.height / 2, 16, '#ff007f', 6);
  }

  addCombo(player.x + player.width / 2, player.y);
  return true;
}

function checkWallKickOnInput(manual = true) {
  if (currentState !== GAME_STATE.PLAYING) return false;
  const leftBorder = 32;
  const rightBorder = VIRTUAL_WIDTH - 32 - player.width;
  if (player.x <= leftBorder) {
    return performWallKick(-1, manual);
  } else if (player.x >= rightBorder) {
    return performWallKick(1, manual);
  }
  return false;
}

// ==========================================
// OYUN AKIŞI & ZIPLAMA (JUMP ACTION)
// ==========================================
function doJump() {
  sounds.init();

  if (currentState === GAME_STATE.START) {
    requestStartGame();
    return;
  }
  if (currentState !== GAME_STATE.PLAYING) return;

  if (!player.isGrounded && checkWallKickOnInput(true)) {
    return;
  }

  if (player.isGrounded || player.coyoteTimer > 0) {
    player.isGrounded = false;
    player.coyoteTimer = 0;

    const speedRatio = Math.abs(player.vx) / player.maxSpeed;
    const isMomentumJump = speedRatio > 0.65;
    const jumpMult = (isIceWorld() || player.onIce) ? 1.5 : 1.0;
    const baseJump = -9.4 * jumpMult;
    const boost = speedRatio * 2.4 * jumpMult;
    player.vy = baseJump - boost;
    playJumpFx(isMomentumJump);
    if (isMomentumJump) shake(comfortMode ? 2 : 3);
  }
}

function requestStartGame() {
  sounds.init();
  if (localStorage.getItem('towerkick_tut') !== '1') {
    if (startOverlay) startOverlay.classList.add('hidden');
    if (tutorialOverlay) tutorialOverlay.classList.remove('hidden');
    return;
  }
  startGame();
}

function finishTutorial() {
  localStorage.setItem('towerkick_tut', '1');
  if (tutorialOverlay) tutorialOverlay.classList.add('hidden');
  startGame();
}

function hideBootSplash(immediate) {
  const el = document.getElementById('bootSplash');
  if (!el || el.classList.contains('hidden')) return;
  if (immediate) {
    el.classList.add('hidden');
    return;
  }
  el.classList.add('fade-out');
  setTimeout(() => el.classList.add('hidden'), 420);
}

function refreshDailyGift() {
  const today = getTodayString();
  const claimed = localStorage.getItem('towerkick_daily') === today;
  if (dailyGiftBtn) dailyGiftBtn.classList.toggle('hidden', claimed);
}

function claimDailyGift() {
  const today = getTodayString();
  if (localStorage.getItem('towerkick_daily') === today) return;
  localStorage.setItem('towerkick_daily', today);
  shop.addCoins(20);
  refreshDailyGift();
  vibrate(22);
  sounds.purchase();
}

function startGame() {
  if (currentState === GAME_STATE.PLAYING) return;
  finalizeRunRecord();
  if (tutorialOverlay) tutorialOverlay.classList.add('hidden');
  sounds.init();
  currentState = GAME_STATE.PLAYING;
  startOverlay.classList.add('hidden');
  pauseOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  if (shopOverlay) shopOverlay.classList.add('hidden');
  if (questOverlay) questOverlay.classList.add('hidden');
  if (wheelOverlay) wheelOverlay.classList.add('hidden');
  if (settingsOverlay) settingsOverlay.classList.add('hidden');
  if (levelsOverlay) levelsOverlay.classList.add('hidden');
  if (levelClearOverlay) levelClearOverlay.classList.add('hidden');
  if (streakOverlay) streakOverlay.classList.add('hidden');
  if (scoresOverlay) scoresOverlay.classList.add('hidden');
  hideBootSplash(true);
  document.body.classList.add('playing');
  pendingBindAction = null;
  resetGhostLive();

  isFeverActive = false;
  feverTimer = 0;
  if (feverOverlay) feverOverlay.classList.add('hidden');
  recordBrokenThisRun = false;
  if (recordBrokenBanner) recordBrokenBanner.classList.add('hidden');

  player.reset(650);
  player.vy = -9.6;
  quakeTimer = 0;
  applyRunSpeed();
  sounds.jump(true);
  sounds.startBGM();
  emitParticles(player.x + player.width / 2, player.y + player.height, 8, '#00f0ff', 3);
  initPlatforms();

  // Aktif Güçlendirici & Biyom Sıfırlama
  activePowerUp = null;
  updateActivePowerUpUI();
  currentBiomeIndex = 0;
  loadQuests();

  // Oyun Moduna Göre Lav & Sayaç Ayarları
  if (selectedMode === GAME_MODES.CLASSIC) {
    lavaY = 999999; // Lav yok
    lavaSpeed = 0;
    if (timeBadge) timeBadge.classList.add('hidden');
  } else if (selectedMode === GAME_MODES.TIME_ATTACK) {
    lavaY = 999999; // Lav yok, 60s geri sayım
    lavaSpeed = 0;
    timeAttackSeconds = 60;
    timeAttackTimer = 0;
    if (timeBadge) {
      timeBadge.classList.remove('hidden');
      if (timeVal) timeVal.textContent = '60s';
    }
  } else if (selectedMode === GAME_MODES.LEVELS) {
    const stage = STAGES.find(s => s.id === currentLevelId) || STAGES[0];
    if (currentLevelId < 10) {
      lavaY = 999999;
      lavaSpeed = 0;
    } else if (currentLevelId < 30) {
      lavaY = 1450;
      lavaSpeed = 0.14;
    } else {
      lavaY = 1250;
      lavaSpeed = 0.28;
    }
    if (timeBadge) {
      timeBadge.classList.remove('hidden');
      if (timeVal) timeVal.textContent = `Hedef: K.${stage.targetFloor}`;
    }
  } else if (selectedMode === GAME_MODES.HELL) {
    lavaY = 780;
    lavaSpeed = 0.95;
    if (timeBadge) timeBadge.classList.add('hidden');
  } else {
    // Normal Lav Modu (Gerçekçi heyecan ve yetişme)
    lavaY = 820;
    lavaSpeed = 0.85;
    if (timeBadge) timeBadge.classList.add('hidden');
  }

  lavaWaveOffset = 0;
  isDeadByLava = false;
  if (lavaDanger) lavaDanger.classList.add('hidden');

  cameraY = player.y - 450;
  cameraTargetY = cameraY;
  particles = [];
  floatingTexts = [];
  trailSystem.reset();
  gameTime = 0;
  scoreValEl.textContent = '0';
  comboContainer.classList.add('hidden');
}

function triggerGameOver(cause = 'lava') {
  if (currentState !== GAME_STATE.PLAYING) return;
  currentState = GAME_STATE.PAUSED;
  deactivateFever();
  sounds.stopBGM();
  sounds.burn();
  shake(comfortMode ? 6 : 16);
  vibrate([50, 40, 60, 50, 80]);

  // Görev İlerlemesini Güncelle
  updateQuestProgress('floor_30', player.highestFloor, true);

  const deathCopy = {
    lava: { title: 'LAV YAKALANDI', tip: 'Paddle kaçırma. Sol/sağ yarıya basıp sıradaki tahtaya kay.' },
    miss: { title: 'PADDLE KAÇTI', tip: 'Rastgele basma. Tahta hangi yarıdaysa o tarafa bas.' },
    ice: { title: 'BUZDA KAYDIN', tip: 'Buzda zıplama 1.5x daha yüksek! Duvarlardan sekerek yukarı tırman.' },
    time: { title: 'SÜRE BİTTİ', tip: 'Sadece ileri paddle’lara odaklan, geri düşme.' },
    quake: { title: 'DENGE BOZULDU', tip: 'Depremde kısa bas, savrulunca ters yarıya bas.' }
  };
  const copy = deathCopy[cause] || deathCopy.miss;
  const titleEl = document.querySelector('.game-over-title');
  if (titleEl) titleEl.textContent = copy.title;
  if (deathTipEl) deathTipEl.textContent = copy.tip;

  finalScoreEl.textContent = player.highestFloor;
  finalBestEl.textContent = bestScore;

  const diff = bestScore - player.highestFloor;
  if (diff > 0 && diff <= 5) {
    nearMissDiffEl.textContent = diff;
    nearMissNoticeEl.classList.remove('hidden');
  } else {
    nearMissNoticeEl.classList.add('hidden');
  }

  pendingRunRecord = true;
  updateReviveUI();

  if (lavaDanger) lavaDanger.classList.add('hidden');
  gameOverOverlay.classList.remove('hidden');
}

function openPauseMenu() {
  if (currentState !== GAME_STATE.PLAYING) return;
  currentState = GAME_STATE.PAUSED;
  sounds.stopBGM();
  inputLeft = false;
  inputRight = false;
  if (pauseCurrentFloor) pauseCurrentFloor.textContent = player.currentFloor || 0;
  if (pauseBestFloor) pauseBestFloor.textContent = bestScore;
  pauseOverlay.classList.remove('hidden');
}

function closePauseMenu() {
  pauseOverlay.classList.add('hidden');
  currentState = GAME_STATE.PLAYING;
  sounds.startBGM();
}

function restartToFloorZero() {
  pauseOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  if (levelClearOverlay) levelClearOverlay.classList.add('hidden');
  startGame();
}

function goToMainMenu() {
  finalizeRunRecord();
  deactivateFever();
  sounds.stopBGM();
  pauseOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  if (shopOverlay) shopOverlay.classList.add('hidden');
  if (questOverlay) questOverlay.classList.add('hidden');
  if (wheelOverlay) wheelOverlay.classList.add('hidden');
  if (settingsOverlay) settingsOverlay.classList.add('hidden');
  if (levelsOverlay) levelsOverlay.classList.add('hidden');
  if (levelClearOverlay) levelClearOverlay.classList.add('hidden');
  if (streakOverlay) streakOverlay.classList.add('hidden');
  if (scoresOverlay) scoresOverlay.classList.add('hidden');
  if (recordBrokenBanner) recordBrokenBanner.classList.add('hidden');
  startOverlay.classList.remove('hidden');
  refreshDailyGift();
  updateReviveUI();
  document.body.classList.remove('playing');
  currentState = GAME_STATE.START;
}

function openShop() {
  if (shopOverlay) {
    shopOverlay.classList.remove('hidden');
    shop.updateCoinUI();
    shop.renderShop();
  }
}

function closeShop() {
  if (shopOverlay) {
    shopOverlay.classList.add('hidden');
  }
}

// ==========================================
// GÜNCELLEME DÖNGÜSÜ (UPDATE)
// ==========================================
function update() {
  if (currentState !== GAME_STATE.PLAYING) return;

  gameTime += 1 / 60;
  applyRunSpeed();

  player.scaleX += (1 - player.scaleX) * 0.15;
  player.scaleY += (1 - player.scaleY) * 0.15;
  player.rotation *= 0.88;
  if (player.coyoteTimer > 0) player.coyoteTimer--;

  if (player.wallKickLockTimer > 0) player.wallKickLockTimer--;

  const iceSlide = isIceWorld() || player.onIce;
  const airControl = player.isGrounded ? 1 : 0.72;
  if (inputLeft && (player.wallKickLockTimer === 0 || player.lastWallKickDir !== -1)) {
    player.vx -= player.accel * airControl * (iceSlide && player.isGrounded ? 0.45 : 1);
    if (player.vx < -player.maxSpeed) player.vx = -player.maxSpeed;
  } else if (inputRight && (player.wallKickLockTimer === 0 || player.lastWallKickDir !== 1)) {
    player.vx += player.accel * airControl * (iceSlide && player.isGrounded ? 0.45 : 1);
    if (player.vx > player.maxSpeed) player.vx = player.maxSpeed;
  } else if (player.wallKickLockTimer === 0) {
    player.vx *= player.friction;
    if (!iceSlide && Math.abs(player.vx) < 0.08) player.vx = 0;
  }

  player.x += player.vx;

  const leftBorder = 16;
  const rightBorder = VIRTUAL_WIDTH - 16 - player.width;

  if (player.x <= leftBorder) {
    player.x = leftBorder;
    player.wallContactFrames++;
    if (player.wallKickLockTimer === 0) {
      performWallKick(-1);
    } else {
      player.vx = 0;
    }
  } else if (player.x >= rightBorder) {
    player.x = rightBorder;
    player.wallContactFrames++;
    if (player.wallKickLockTimer === 0) {
      performWallKick(1);
    } else {
      player.vx = 0;
    }
  } else {
    player.wallContactFrames = 0;
  }

  let gravity = iceSlide ? 0.40 : 0.42;
  if (activePowerUp && activePowerUp.type === 'star') gravity *= 0.62;
  player.vy += gravity;
  player.y += player.vy;

  // İZ BIRAKMA (TRAIL DROP)
  const isMoving = Math.abs(player.vx) > 0.5 || Math.abs(player.vy) > 1;
  trailSystem.dropTrail(
    player.x + player.width / 2,
    player.y + player.height,
    isMoving
  );
  trailSystem.update();

  // PLATFORM ÇARPIŞMALARI (Kusursuz Tek Yönlü Çarpışma - Tunneling Önleyici)
  let landedThisFrame = false;
  player.onIce = false;

  if (player.vy > 0) {
    for (const plat of platforms) {
      if (plat.broken) continue;

      const playerBottom = player.y + player.height;
      const prevBottom = playerBottom - player.vy;

      if (
        player.x + player.width > plat.x &&
        player.x < plat.x + plat.width &&
        prevBottom <= plat.y + 6 &&
        playerBottom >= plat.y
      ) {
        // Hayalet platform saydamsa (inaktifse) temas etmeden içinden düş
        if (plat.type === PLATFORM_TYPES.GHOST && !plat.isGhostActive) {
          continue;
        }

        player.y = plat.y - player.height;
        player.vy = 0;
        player.isGrounded = true;
        player.hasDoubleJump = false;
        player.lastWallKickDir = 0;
        player.wallKickCount = 0;
        player.airWallKicks = 0;
        player.wallWarnShown = false;
        player.scaleX = 1.35;
        player.scaleY = 0.7;
        landedThisFrame = true;

        player.currentFloor = plat.floor;
        scoreValEl.textContent = player.currentFloor;
        collectLootOnPlatform(plat);

        if (plat.floor > player.highestFloor) {
          const oldHighest = player.highestFloor;
          player.highestFloor = plat.floor;

          // Her 25 katta bir (25F, 50F, 75F, 100F...) BÜYÜK KUTLAMA VE ELMAS ÖDÜLÜ!
          if (Math.floor(player.highestFloor / 25) > Math.floor(oldHighest / 25)) {
            const milestoneFloor = Math.floor(player.highestFloor / 25) * 25;
            sounds.combo(6);
            vibrate([50, 40, 50, 40, 60]);
            shake(14);
            shop.addCoins(10); // +10 Elmas Hediye!
            floatingTexts.push(new FloatingText(`🏆 KAT ${milestoneFloor}! (+10 💎)`, VIRTUAL_WIDTH / 2, player.y - 40, '#ffe600'));
            emitParticles(player.x + player.width / 2, player.y, 35, '#ffe600', 8);
            emitParticles(player.x + player.width / 2, player.y, 30, '#00f0ff', 7);
          }

          // REKOR AŞMA KUTLAMASI (RECORD BROKEN BANNER)
          if (player.highestFloor > bestScore) {
            if (bestScore > 3 && !recordBrokenThisRun) {
              recordBrokenThisRun = true;
              sounds.combo(8);
              shake(14);
              vibrate([40, 50, 60, 50, 70]);
              if (recordBrokenBanner) {
                recordBrokenBanner.classList.remove('hidden');
                setTimeout(() => {
                  if (recordBrokenBanner) recordBrokenBanner.classList.add('hidden');
                }, 3500);
              }
              floatingTexts.push(new FloatingText("🎉 YENİ REKOR KIRILDI! 🏆", VIRTUAL_WIDTH / 2, player.y - 45, '#ffe600'));
              emitParticles(player.x + player.width / 2, player.y, 40, '#ffe600', 8);
              emitParticles(player.x + player.width / 2, player.y, 30, '#00f0ff', 7);
            }
            bestScore = player.highestFloor;
            localStorage.setItem('towerkick_best', bestScore);
            bestValEl.textContent = bestScore;
          }
        }

        // Özel Platformlar
        if (plat.type === PLATFORM_TYPES.BOOST) {
          sounds.spring();
          sounds.doubleJump();
          shake(12);
          vibrate([30, 40, 30]);
          player.vy = -22.5; // Süper Roket Fırlaması! 8-10 kat birden fırlar
          player.isGrounded = false;
          emitParticles(plat.x + plat.width / 2, plat.y, 24, '#ff0055', 9);
          emitParticles(plat.x + plat.width / 2, plat.y, 16, '#ffe600', 7);
          floatingTexts.push(new FloatingText("HYPER BOOST! 🚀🔥", plat.x + plat.width / 2, plat.y, '#ff0055'));
          addCombo(player.x + player.width / 2, player.y);
          addCombo(player.x + player.width / 2, player.y);
        } else if (plat.type === PLATFORM_TYPES.SPRING) {
          sounds.spring();
          shake(7);
          vibrate(30);
          player.vy = -17.5;
          player.isGrounded = false;
          emitParticles(plat.x + plat.width / 2, plat.y, 16, '#ffe600', 7);
          floatingTexts.push(new FloatingText("SUPER BOUNCE!", plat.x + plat.width / 2, plat.y, '#ffe600'));
          addCombo(player.x + player.width / 2, player.y);
        } else if (plat.type === PLATFORM_TYPES.PORTAL) {
          sounds.portal();
          shake(9);
          vibrate([25, 30, 35]);
          player.vy = -19.5; // Güçlü portal fırlaması
          player.isGrounded = false;
          emitParticles(plat.x + plat.width / 2, plat.y, 24, '#9d00ff', 7);
          emitParticles(plat.x + plat.width / 2, plat.y, 14, '#00f0ff', 6);
          floatingTexts.push(new FloatingText("PORTAL WARP! 🌀", plat.x + plat.width / 2, plat.y, '#9d00ff'));
          addCombo(player.x + player.width / 2, player.y);
        } else if (plat.type === PLATFORM_TYPES.WIND) {
          sounds.doubleJump();
          shake(5);
          vibrate(25);
          player.vy = -16.0;
          player.isGrounded = false;
          emitParticles(plat.x + plat.width / 2, plat.y, 18, '#00bcd4', 6);
          floatingTexts.push(new FloatingText("WIND GUST! 💨", plat.x + plat.width / 2, plat.y, '#00bcd4'));
          addCombo(player.x + player.width / 2, player.y);
        } else if (plat.type === PLATFORM_TYPES.BOMB) {
          if (!plat.armed) {
            plat.armed = true;
            plat.fuse = 32; // ~0.5sn
            sounds.bombTick();
            vibrate(20);
          }
          // Normal zıplama
          const speedRatio = Math.abs(player.vx) / player.maxSpeed;
          const isMomentumJump = speedRatio > 0.65;
          player.vy = -11.0 - speedRatio * 3.4;
          player.isGrounded = false;
          sounds.jump(isMomentumJump);
          vibrate(isMomentumJump ? 22 : 14);
          player.scaleX = 0.7;
          player.scaleY = 1.4;
        } else if (plat.type === PLATFORM_TYPES.ICE) {
          if (!plat.landed) {
            plat.landed = true;
            vibrate(12);
            player.iceHopTimer = 16;
          }
          player.onIce = true;
          player.vy = 0;
          player.isGrounded = true;
        } else {
          player.onIce = isIceWorld();
          const speedRatio = Math.abs(player.vx) / player.maxSpeed;
          const isMomentumJump = speedRatio > 0.65;
          const jumpMult = isIceWorld() ? 1.5 : 1.0;
          const baseJump = -9.4 * jumpMult;
          const boost = speedRatio * 2.4 * jumpMult;
          player.vy = baseJump - boost;
          player.isGrounded = false;
          playJumpFx(isMomentumJump);
        }
        break;
      }
    }
  }

  if (!landedThisFrame && player.isGrounded) {
    player.isGrounded = false;
    player.coyoteTimer = 8;
    player.iceHopTimer = 0;
  }

  if (player.iceHopTimer > 0) {
    if (!player.isGrounded) {
      player.iceHopTimer = 0;
    } else {
      player.iceHopTimer--;
      if (player.iceHopTimer <= 0) {
        const speedRatio = Math.abs(player.vx) / player.maxSpeed;
        const jumpMult = 1.5; // Buzlu paddler dahil 1.5x zıplama
        player.vy = (-9.4 - speedRatio * 2.4) * jumpMult;
        player.isGrounded = false;
        player.onIce = false;
        playJumpFx(speedRatio > 0.65);
      }
    }
  }

  // GÜÇLENDİRİCİ AKTİF SAYAÇ VE JETPACK İTİŞİ
  if (activePowerUp) {
    if (activePowerUp.type !== 'shield') {
      activePowerUp.timer--;
      if (activePowerUp.timer <= 0) {
        activePowerUp = null;
      }
    }
    updateActivePowerUpUI();
  }

  if (activePowerUp && activePowerUp.type === 'jetpack') {
    player.vy = -9.2;
    player.isGrounded = false;
    emitParticles(player.x + player.width / 2, player.y + player.height, 2, '#ffe600', 4);
  }

  // PLATFORMLARIN HAREKET, BOMBA VE HAYALET RİTMİ
  for (const plat of platforms) {
    if (plat.type === PLATFORM_TYPES.GHOST) {
      const phase = Math.sin(gameTime * 0.05 + plat.floor * 0.7);
      plat.isGhostActive = phase > -0.25;
    } else if (plat.type === PLATFORM_TYPES.MOVING) {
      plat.x += plat.vx;
      if (plat.x <= 20 || plat.x + plat.width >= VIRTUAL_WIDTH - 20) {
        plat.vx *= -1;
      }
    } else if (plat.type === PLATFORM_TYPES.BOMB && plat.armed && !plat.broken) {
      plat.fuse--;
      if (plat.fuse % 8 === 0 && plat.fuse > 0) {
        sounds.bombTick();
      }
      if (plat.fuse <= 0) {
        plat.broken = true;
        sounds.bombExplode();
        shake(6);
        vibrate(45);
        emitParticles(plat.x + plat.width / 2, plat.y, 25, '#ff4400', 8);
        floatingTexts.push(new FloatingText("BOOM! 💣💥", plat.x + plat.width / 2, plat.y, '#ff4400'));
        if (player.isGrounded && Math.abs(player.y + player.height - plat.y) < 5) {
          player.isGrounded = false;
          player.vy = 2;
        }
      }
    } else if (plat.type === PLATFORM_TYPES.ICE && plat.landed && !plat.broken) {
      plat.breakTimer++;
      plat.shakeX = (Math.random() - 0.5) * 4;

      if (plat.breakTimer >= plat.maxBreakTime) {
        plat.broken = true;
        sounds.iceCrack();
        vibrate(35);
        shake(5);
        emitParticles(plat.x + plat.width / 2, plat.y + plat.height / 2, 20, '#a5f3fc', 5);
        floatingTexts.push(new FloatingText("CRACK! 🧊", plat.x + plat.width / 2, plat.y, '#a5f3fc'));

        if (player.isGrounded && Math.abs(player.y + player.height - plat.y) < 5) {
          player.isGrounded = false;
        }
      }
    }
  }

  // ELMAS TOPLAMA + GÜÇLENDİRİLMİŞ MANYETİK ÇEKİM (GEM MAGNET)
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;
  const isMagnetActive = activePowerUp && activePowerUp.type === 'magnet';
  const magnetRange = isMagnetActive ? 320 : (isFeverActive ? 280 : 90);

  for (const g of gems) {
    if (g.collected) continue;
    const dx = playerCenterX - g.x;
    const dy = playerCenterY - g.y;
    const dist = Math.hypot(dx, dy);

    // Manyetik çekim (oyuncu yaklaştıkça veya mıknatıs/fever ile elmas oyuncuya uçar)
    if (dist < magnetRange && dist > 1) {
      const pullForce = (1 - dist / magnetRange) * (isMagnetActive ? 9.5 : (isFeverActive ? 8.5 : 5.5));
      g.x += (dx / dist) * pullForce;
      g.y += (dy / dist) * pullForce;
    }

    if (dist < 28) collectGem(g);
  }

  // GÜÇLENDİRİCİ (POWER-UP) TOPLAMA
  for (const pu of powerUps) {
    if (pu.collected) continue;
    const dx = playerCenterX - pu.x;
    const dy = playerCenterY - pu.y;
    if (Math.hypot(dx, dy) < 32) {
      collectPowerUp(pu);
    }
  }

  // GİZEMLİ ŞANS KUTULARI (MYSTERY CRATES) ETKİLEŞİMİ
  for (const crate of mysteryCrates) {
    if (crate.broken) continue;
    crate.update();

    const dx = playerCenterX - (crate.x + crate.width / 2);
    const dy = playerCenterY - (crate.y + crate.height / 2);
    if (Math.hypot(dx, dy) < 32) {
      crate.broken = true;
      sounds.purchase();
      shake(10);
      vibrate([40, 30, 50]);
      emitParticles(crate.x + crate.width / 2, crate.y, 25, '#ffe600', 7);

      const roll = Math.random();
      if (roll < 0.45) {
        // Jackpot Elmas!
        const jackpot = Math.floor(Math.random() * 20) + 20; // 20-40 💎
        shop.addCoins(jackpot);
        floatingTexts.push(new FloatingText(`📦 JACKPOT! +${jackpot} 💎`, crate.x + crate.width / 2, crate.y - 20, '#00ffaa'));
      } else if (roll < 0.75) {
        // Süper Roket Fırlaması!
        activePowerUp = { type: POWER_UP_TYPES.JETPACK, timer: 210, maxTimer: 210 };
        updateActivePowerUpUI();
        floatingTexts.push(new FloatingText("📦 SÜPER ROKET ÇIKTI! 🚀", crate.x + crate.width / 2, crate.y - 20, '#ffe600'));
      } else {
        // Koruma Kalkanı!
        activePowerUp = { type: POWER_UP_TYPES.SHIELD, timer: 999999, maxTimer: 999999 };
        updateActivePowerUpUI();
        floatingTexts.push(new FloatingText("📦 LAV KALKANI ÇIKTI! 🛡️", crate.x + crate.width / 2, crate.y - 20, '#ff007f'));
      }
    }
  }

  // FEVER MODU SÜRE VE PARÇACIK GÜNCELLEMESİ
  if (isFeverActive) {
    feverTimer--;
    if (Math.random() < 0.25) {
      emitParticles(player.x + player.width / 2, player.y + player.height / 2, 2, '#ffe600', 3);
    }
    if (feverTimer <= 0) {
      deactivateFever();
    }
  }

  // UÇAN CANAVARLAR (HAZARDS) VE EZME (STOMP) MEKANİĞİ
  for (const enemy of flyingEnemies) {
    enemy.update();
    if (enemy.squashed) continue;

    const enemyBottom = enemy.y + enemy.height;
    const enemyTop = enemy.y;
    const playerBottom = player.y + player.height;
    const playerPrevBottom = playerBottom - player.vy;

    // STOMP: Oyuncu canavarın kafasına basarsa
    if (
      player.vy > 0 &&
      player.x + player.width > enemy.x &&
      player.x < enemy.x + enemy.width &&
      playerPrevBottom <= enemyTop + 14 &&
      playerBottom >= enemyTop - 4
    ) {
      enemy.squashed = true;
      enemy.squashTimer = 25;
      player.vy = -14.5; // Ekstra sıçrama!
      player.scaleX = 0.7;
      player.scaleY = 1.4;
      sounds.stomp();
      vibrate(35);
      shake(6);
      shop.addCoins(5);
      updateQuestProgress('stomp_2', 1);
      floatingTexts.push(new FloatingText("STOMP! 👟💥 (+5 💎)", enemy.x + enemy.width / 2, enemy.y, '#00ffaa'));
      emitParticles(enemy.x + enemy.width / 2, enemy.y, 20, '#ff007f', 6);
      addCombo(enemy.x + enemy.width / 2, enemy.y);
    } else if (
      // Yan veya alttan çarpma (knockback)
      player.x + player.width > enemy.x &&
      player.x < enemy.x + enemy.width &&
      player.y + player.height > enemy.y &&
      player.y < enemyBottom
    ) {
      sounds.fall();
      vibrate(25);
      shake(4);
      player.vx = player.x < enemy.x ? -5.5 : 5.5;
      player.vy = 2;
    }
  }

  // ELEBAŞI (BOSS ENCOUNTERS) GÜNCELLEME VE VURUŞ ETKİLEŞİMLERİ
  for (const boss of bossEnemies) {
    boss.update();
    if (boss.defeated) continue;

    const bossBottom = boss.y + boss.height;
    const bossTop = boss.y;
    const playerBottom = player.y + player.height;
    const playerPrevBottom = playerBottom - player.vy;

    // STOMP: Boss kafasına basarak hasar verme
    if (
      player.vy > 0 &&
      player.x + player.width > boss.x &&
      player.x < boss.x + boss.width &&
      playerPrevBottom <= bossTop + 18 &&
      playerBottom >= bossTop - 6
    ) {
      boss.hp--;
      boss.flashTimer = 14;
      player.vy = -16.5; // Dev sıçrama!
      player.scaleX = 0.65;
      player.scaleY = 1.45;
      sounds.stomp();
      vibrate([30, 25, 35]);
      shake(10);
      emitParticles(boss.x + boss.width / 2, boss.y, 22, '#ff0055', 7);

      if (boss.hp <= 0) {
        boss.defeated = true;
        boss.defeatTimer = 45;
        const reward = boss.isFinal ? 100 : 50;
        shop.addCoins(reward);
        sounds.purchase();
        vibrate([60, 50, 60, 50, 100]);
        shake(16);
        floatingTexts.push(new FloatingText(`🏆 ${boss.name} YOK EDİLDİ! (+${reward} 💎)`, VIRTUAL_WIDTH / 2, boss.y - 40, '#00ffaa'));
        emitParticles(boss.x + boss.width / 2, boss.y, 45, '#ffe600', 8);
        emitParticles(boss.x + boss.width / 2, boss.y, 35, '#00f0ff', 7);
        addCombo(boss.x + boss.width / 2, boss.y);
        addCombo(boss.x + boss.width / 2, boss.y);
        // Boss ödülü olarak süper roket güçlendiricisi ver!
        activePowerUp = { type: POWER_UP_TYPES.JETPACK, timer: 210, maxTimer: 210 };
        updateActivePowerUpUI();
        floatingTexts.push(new FloatingText("🚀 SÜPER ROKET KAZANDIN!", VIRTUAL_WIDTH / 2, boss.y - 65, '#ffe600'));
      } else {
        floatingTexts.push(new FloatingText(`-1 CAN! 💥 (${boss.hp}/${boss.maxHp})`, boss.x + boss.width / 2, boss.y - 20, '#ffe600'));
      }
    } else if (
      // Yan veya alttan çarpma (Boss knockback)
      player.x + player.width > boss.x &&
      player.x < boss.x + boss.width &&
      player.y + player.height > boss.y &&
      player.y < bossBottom
    ) {
      sounds.fall();
      vibrate(30);
      shake(6);
      player.vx = player.x < boss.x ? -6.5 : 6.5;
      player.vy = 2;
    }
  }

  // Kombo Barı
  if (player.comboTimer > 0) {
    player.comboTimer--;
    const pct = (player.comboTimer / player.maxComboTimer) * 100;
    comboFillEl.style.width = `${pct}%`;
    if (player.comboTimer === 0) {
      player.comboCount = 0;
      comboContainer.classList.add('hidden');
    }
  }

  recordGhostSample();

  // KAMERA TAKİBİ
  cameraTargetY = player.y - 430;
  const maxCamY = 700 - VIRTUAL_HEIGHT + 60;
  if (cameraTargetY > maxCamY) cameraTargetY = maxCamY;

  const camSpeed = cameraTargetY > cameraY ? 0.20 : 0.12;
  cameraY += (cameraTargetY - cameraY) * camSpeed;

  // 0. KAT & TABAN ZEMİNİ: ASLA TAKILMAYAN KESİN VE GÜÇLÜ OTOMATİK SIÇRAMA!
  if (player.y + player.height >= 700) {
    player.y = 700 - player.height;
    const speedRatio = Math.abs(player.vx) / player.maxSpeed;
    const isMomentumJump = speedRatio > 0.65;
    const baseJump = -12.5;
    const boost = speedRatio * 3.5;
    player.vy = baseJump - boost;
    player.isGrounded = false;
    player.hasDoubleJump = false;
    player.lastWallKickDir = 0;
    player.wallKickCount = 0;
    player.airWallKicks = 0;
    player.wallWarnShown = false;
    player.scaleX = 0.7;
    player.scaleY = 1.4;

    if (player.currentFloor > 3) {
      triggerGameOver(isIceWorld() ? 'ice' : 'miss');
      return;
    }
    playJumpFx(isMomentumJump);

    player.currentFloor = 0;
    scoreValEl.textContent = '0';
    vibrate(isMomentumJump ? 22 : 14);
    emitParticles(player.x + player.width / 2, 700, 10, '#00f0ff', 4);
    if (isMomentumJump) {
      shake(comfortMode ? 2 : 4);
    }
  }

  // ==========================================
  // ZAMAN YARIŞI & BÖLÜM (LEVELS) TAMAMLAMA
  // ==========================================
  if (selectedMode === GAME_MODES.TIME_ATTACK) {
    timeAttackTimer++;
    if (timeAttackTimer >= 60) {
      timeAttackTimer = 0;
      timeAttackSeconds--;
      if (timeVal) timeVal.textContent = timeAttackSeconds + 's';
      if (timeAttackSeconds <= 0) {
        triggerGameOver('time');
      }
    }
  } else if (selectedMode === GAME_MODES.LEVELS) {
    const stage = STAGES.find(s => s.id === currentLevelId);
    if (stage && player.highestFloor >= stage.targetFloor) {
      triggerLevelClear();
      return;
    }
  }

  checkBiomeProgression(player.highestFloor);

  if (selectedMode === GAME_MODES.LEVELS && currentLevelId >= 30) {
    quakeTimer++;
    if (quakeTimer % 42 === 0) shake(3);
    if (quakeTimer % 160 === 0) {
      shake(12);
      player.vx += (Math.random() - 0.5) * 5.2;
      player.x += (Math.random() - 0.5) * 14;
      vibrate(30);
      floatingTexts.push(new FloatingText("DEPREM!  titretiyor", VIRTUAL_WIDTH / 2, player.y - 28, '#ffe600'));
    }
  }

  // ==========================================
  // YÜKSELEN LAV SİSTEMİ & DİNAMİK HIZLANMA
  // ==========================================
  if (
    selectedMode === GAME_MODES.CLASSIC ||
    selectedMode === GAME_MODES.TIME_ATTACK ||
    (selectedMode === GAME_MODES.LEVELS && currentLevelId < 10)
  ) {
    lavaY = 999999;
    if (lavaDanger) lavaDanger.classList.add('hidden');
  } else {
    lavaWaveOffset += 0.05;
    const isFrozen = activePowerUp && activePowerUp.type === 'freeze';
    if (!isFrozen) {
      const isHell = selectedMode === GAME_MODES.HELL;
      const levelLavaBoost = selectedMode === GAME_MODES.LEVELS && currentLevelId >= 30 ? 0.35 : 0;
      const floorFactor = Math.min(player.highestFloor * (isHell ? 0.055 : 0.035), 3.2);
      const timeFactor = Math.min(gameTime * (isHell ? 0.020 : 0.012), 2.2);
      const baseSpeed = isHell ? 0.95 : (selectedMode === GAME_MODES.LEVELS ? 0.45 : 0.82);
      
      // Oyuncu lavdan çok uzaklaştığında agresif yetişme (catch-up) ivmesi
      const playerBottom = player.y + player.height;
      const distAbove = lavaY - playerBottom;
      const catchupSpeed = distAbove > 280 ? Math.min(3.8, (distAbove - 280) * 0.012) : 0;

      lavaSpeed = baseSpeed + floorFactor + timeFactor + levelLavaBoost + catchupSpeed;
      lavaY -= lavaSpeed;

      // Lavdan yükselen alev kıvılcımları (Embers - Hafif ve donma yapmayan frekans)
      if (Math.random() < 0.14) {
        particles.push(new Particle(
          Math.random() * VIRTUAL_WIDTH,
          lavaY + Math.random() * 8,
          (Math.random() - 0.5) * 1.5,
          -Math.random() * 2.2 - 1.0,
          Math.random() > 0.4 ? '#ff4400' : '#ffe600',
          Math.random() * 2.5 + 1.5,
          18
        ));
      }
    }

    // Lav Tehlike Mesafesi Kontrolü
    const playerBottomY = player.y + player.height;
    const distToLava = lavaY - playerBottomY;

    if (distToLava < 220 && distToLava > 0) {
      if (lavaDanger) {
        lavaDanger.textContent = getCurrentBiome().dangerText;
        lavaDanger.classList.remove('hidden');
      }
    } else {
      if (lavaDanger) lavaDanger.classList.add('hidden');
    }

    // Lava Temas ve Yanma (Game Over veya Shield)
    if (playerBottomY >= lavaY && !isDeadByLava) {
      if (activePowerUp && activePowerUp.type === 'shield') {
        activePowerUp = null;
        updateActivePowerUpUI();
        sounds.shieldBreak();
        shake(14);
        vibrate([40, 50, 60]);
        lavaY = player.y + 350;
        player.vy = -19.0;
        player.isGrounded = false;
        floatingTexts.push(new FloatingText("KALKAN KURTARDI! 🛡️💥", player.x + player.width / 2, player.y - 25, '#ff007f'));
        emitParticles(player.x + player.width / 2, player.y + player.height, 35, '#ff007f', 9);
      } else {
        isDeadByLava = true;
        emitParticles(player.x + player.width / 2, playerBottomY, 35, '#ff2200', 7);
        emitParticles(player.x + player.width / 2, playerBottomY, 25, '#ffe600', 5);
        triggerGameOver(isIceWorld() ? 'ice' : 'lava');
      }
    }
  }

  generateMorePlatforms();

  // Efektler
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].update();
    if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
  }
  if (floatingTexts.length > 5) {
    floatingTexts.splice(0, floatingTexts.length - 5);
  }

  if (screenShake > 0) {
    screenShake *= 0.88;
    if (screenShake < 0.2) screenShake = 0;
  }
}

// ==========================================
// ÇİZİM (RENDER)
// ==========================================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  if (screenShake > 0) {
    const mult = (comfortMode || lowFx) ? 0.28 : 1.0;
    const ox = (Math.random() - 0.5) * screenShake * scaleRatio * 2 * mult;
    const oy = (Math.random() - 0.5) * screenShake * scaleRatio * 2 * mult;
    ctx.translate(ox, oy);
  }

  drawBackground();
  drawWalls();
  drawTrails();
  drawPlatforms();
  drawPowerUps();
  drawMysteryCrates();
  drawFlyingEnemies();
  drawBossEnemies();
  drawGems();
  drawLava(); // Yükselen lav tabakası

  for (const p of particles) {
    p.draw(ctx, cameraY);
  }

  drawGhost();
  drawPlayer();

  for (const ft of floatingTexts) {
    ft.draw(ctx, cameraY);
  }

  ctx.restore();
}

function drawGhost() {
  if (!ghostBest.length || currentState === GAME_STATE.START) return;
  let nearest = ghostBest[0];
  let dist = Math.abs(nearest.y - player.y);
  for (let i = 1; i < ghostBest.length; i++) {
    const d = Math.abs(ghostBest[i].y - player.y);
    if (d < dist) {
      dist = d;
      nearest = ghostBest[i];
    }
  }
  if (dist > 36) return;
  const gx = nearest.x * scaleRatio;
  const gy = (nearest.y - cameraY) * scaleRatio;
  const gw = player.width * scaleRatio;
  const gh = player.height * scaleRatio;
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = '#e8f6ff';
  ctx.beginPath();
  ctx.roundRect(gx, gy, gw, gh, 7 * scaleRatio);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 230, 0, 0.55)';
  ctx.lineWidth = 1.5 * scaleRatio;
  ctx.stroke();
  ctx.restore();
}

function drawBackground() {
  const biome = getCurrentBiome();
  const theme = biome.theme;

  // Pixel-soft vertical gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, biome.bg2);
  grad.addColorStop(1, biome.bg);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (comfortMode) return;

  const scroll = (-cameraY * 0.35);
  const t = gameTime;
  const lite = lowFx;

  if (theme === 'plain') {
    const bricks = lite ? 5 : 9;
    for (let i = 0; i < bricks; i++) {
      const y = ((i * 92 + scroll * 0.22) % (VIRTUAL_HEIGHT + 50)) - 24;
      pxFill(32 + (i % 2) * 6, y, 26, 14, '#1a2834');
      pxFill(VIRTUAL_WIDTH - 62 - (i % 3) * 4, y + 28, 22, 12, '#1a2834');
      pxFill(36 + (i % 2) * 6, y + 2, 6, 4, '#2a3c4a');
    }
    const motes = lite ? 6 : 14;
    for (let i = 0; i < motes; i++) {
      const y = ((i * 70 + scroll * 0.4 + t * 8) % (VIRTUAL_HEIGHT + 20)) - 10;
      pxFill(50 + (i * 37) % (VIRTUAL_WIDTH - 80), y, 2, 2, '#8aa4b8');
    }
  } else if (theme === 'magma') {
    // Yanardağ embers + brick stripes
    for (let i = 0; i < (lite ? 8 : 18); i++) {
      const seed = i * 97.3;
      const x = ((seed * 13) % (VIRTUAL_WIDTH - 40)) + 20;
      const y = ((scroll * 0.6 + seed * 40 + t * 28) % (VIRTUAL_HEIGHT + 40)) - 20;
      const sz = 2 + (i % 3);
      pxFill(x, y, sz, sz, i % 2 ? '#ff6a00' : '#ffcc33');
    }
    // Magma rock blobs
    for (let i = 0; i < 6; i++) {
      const y = ((i * 130 + scroll * 0.2) % (VIRTUAL_HEIGHT + 80)) - 40;
      pxFill(28 + (i % 3) * 8, y, 22, 14, '#2a0c06');
      pxFill(VIRTUAL_WIDTH - 56 - (i % 3) * 6, y + 40, 20, 12, '#2a0c06');
    }
  } else if (theme === 'ice') {
    // Şelale (sol + sağ duvar kenarı)
    for (let col = 0; col < (lite ? 2 : 3); col++) {
      for (let row = 0; row < (lite ? 12 : 22); row++) {
        const fall = (t * 90 + row * 18 + col * 11) % (VIRTUAL_HEIGHT + 30);
        const alpha = 0.35 + (row % 3) * 0.15;
        ctx.globalAlpha = alpha;
        pxFill(18 + col * 5, fall - 30, 4, 10, col === 1 ? '#b8f0ff' : '#5ec8ff');
        pxFill(VIRTUAL_WIDTH - 34 - col * 5, (fall + 40) % (VIRTUAL_HEIGHT + 30) - 30, 4, 10, col === 1 ? '#dffffa' : '#7ad7ff');
      }
    }
    ctx.globalAlpha = 1;
    // Buz kristalleri
    const flakes = lite ? 6 : 14;
    for (let i = 0; i < flakes; i++) {
      const y = ((i * 85 + scroll * 0.25 + t * 12) % (VIRTUAL_HEIGHT + 60)) - 30;
      const x = 40 + (i % 5) * 80;
      pxFill(x, y, 6, 14, '#c8f4ff');
      pxFill(x - 4, y + 6, 14, 6, '#8adfff');
      pxFill(x + 2, y + 2, 2, 2, '#ffffff');
    }
  } else if (theme === 'neon') {
    // Pixel city skyline
    for (let i = 0; i < 12; i++) {
      const bw = 18 + (i % 4) * 8;
      const bh = 40 + ((i * 37) % 120);
      const x = 24 + i * 38;
      const y = VIRTUAL_HEIGHT - bh + ((scroll * 0.15) % 20);
      pxFill(x, y, bw, bh, i % 2 ? '#140820' : '#1c0a2e');
      // Windows
      for (let wy = y + 6; wy < y + bh - 6; wy += 10) {
        for (let wx = x + 3; wx < x + bw - 4; wx += 7) {
          if (((wx + wy + Math.floor(t * 2)) % 5) !== 0) {
            pxFill(wx, wy, 3, 4, (wx + wy) % 2 ? '#ff00aa' : '#00f0ff');
          }
        }
      }
    }
    // Neon scanlines
    ctx.strokeStyle = biome.grid;
    ctx.lineWidth = 1;
    for (let y = (scroll % 16); y < VIRTUAL_HEIGHT; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y * scaleRatio);
      ctx.lineTo(canvas.width, y * scaleRatio);
      ctx.stroke();
    }
  } else if (theme === 'space') {
    // Stars
    for (let i = 0; i < (lite ? 18 : 40); i++) {
      const seed = i * 53.1;
      const x = (seed * 19) % VIRTUAL_WIDTH;
      const y = ((seed * 7 + scroll * 0.5) % VIRTUAL_HEIGHT);
      const twinkle = (Math.sin(t * 3 + i) + 1) * 0.5;
      if (twinkle > 0.25) {
        pxFill(x, y, 1 + (i % 2), 1 + (i % 2), i % 3 === 0 ? '#ffe600' : '#ffffff');
      }
    }
    // Distant planet
    const px = VIRTUAL_WIDTH * 0.72;
    const py = 90 + Math.sin(t * 0.4) * 6;
    pxFill(px - 18, py - 18, 36, 36, '#2a1a60');
    pxFill(px - 12, py - 12, 24, 24, '#4a2a9a');
    pxFill(px - 4, py - 8, 10, 6, '#7c5cff');
  }

  // Shared pixel grid (coarse)
  ctx.strokeStyle = biome.grid;
  ctx.lineWidth = 1 * scaleRatio;
  const gridSize = 40;
  ctx.beginPath();
  for (let x = 0; x < VIRTUAL_WIDTH; x += gridSize) {
    ctx.moveTo(x * scaleRatio, 0);
    ctx.lineTo(x * scaleRatio, canvas.height);
  }
  const offsetY = (scroll) % gridSize;
  for (let y = offsetY; y < VIRTUAL_HEIGHT; y += gridSize) {
    ctx.moveTo(0, y * scaleRatio);
    ctx.lineTo(canvas.width, y * scaleRatio);
  }
  ctx.stroke();
}

function drawWalls() {
  const biome = getCurrentBiome();
  const shopWall = shop.getWallColor(gameTime);
  const wallColor = shopWall || biome.wall;

  // Pixel brick walls
  ctx.fillStyle = biome.wallDark;
  ctx.fillRect(0, 0, 16 * scaleRatio, canvas.height);
  ctx.fillRect((VIRTUAL_WIDTH - 16) * scaleRatio, 0, 16 * scaleRatio, canvas.height);

  const brickH = 10;
  const scroll = (-cameraY) % (brickH * 2);
  for (let y = -brickH * 2 + scroll; y < VIRTUAL_HEIGHT + brickH; y += brickH) {
    const row = Math.floor((y + cameraY) / brickH);
    const offset = (row % 2) * 4;
    pxFill(0, y, 16, brickH - 1, row % 3 === 0 ? biome.wallDark : 'rgba(0,0,0,0.35)');
    pxFill(VIRTUAL_WIDTH - 16, y, 16, brickH - 1, row % 3 === 0 ? biome.wallDark : 'rgba(0,0,0,0.35)');
    // Mortar lines
    ctx.fillStyle = wallColor;
    ctx.globalAlpha = 0.55;
    pxFill(offset, y + brickH - 1, 16, 1, wallColor);
    pxFill(VIRTUAL_WIDTH - 16 + offset, y + brickH - 1, 16, 1, wallColor);
    ctx.globalAlpha = 1;
  }

  // Outer neon/ice rim
  ctx.strokeStyle = wallColor;
  ctx.lineWidth = 3 * scaleRatio;
  ctx.beginPath();
  ctx.moveTo(16 * scaleRatio, 0);
  ctx.lineTo(16 * scaleRatio, canvas.height);
  ctx.moveTo((VIRTUAL_WIDTH - 16) * scaleRatio, 0);
  ctx.lineTo((VIRTUAL_WIDTH - 16) * scaleRatio, canvas.height);
  ctx.stroke();

  // Ice waterfall foam on wall edge
  if (biome.theme === 'ice' && !comfortMode) {
    for (let i = 0; i < 8; i++) {
      const y = ((gameTime * 70 + i * 90) % (VIRTUAL_HEIGHT + 20)) - 10;
      pxFill(14, y, 3, 8, '#e8ffff');
      pxFill(VIRTUAL_WIDTH - 17, y + 20, 3, 8, '#e8ffff');
    }
  }
}

function drawLava() {
  const screenLavaY = (lavaY - cameraY) * scaleRatio;
  if (screenLavaY > canvas.height + 150) return;

  const biome = getCurrentBiome();
  const isFrozen = activePowerUp && activePowerUp.type === 'freeze';

  ctx.save();

  const grad = ctx.createLinearGradient(0, screenLavaY, 0, canvas.height);
  if (isFrozen) {
    grad.addColorStop(0, '#a5f3fc');
    grad.addColorStop(1, '#023e8a');
  } else {
    grad.addColorStop(0, biome.hazardTop);
    grad.addColorStop(1, biome.hazardBot);
  }

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(0, screenLavaY);

  const wavePoints = 12;
  const step = VIRTUAL_WIDTH / wavePoints;
  for (let i = 0; i <= wavePoints; i++) {
    const wx = i * step;
    const amp = biome.theme === 'ice' ? 6 : biome.theme === 'space' ? 3 : 4;
    const wy = screenLavaY + Math.sin(wx * 0.05 + lavaWaveOffset * 2.0) * (amp * scaleRatio);
    ctx.lineTo(wx * scaleRatio, wy);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.closePath();
  ctx.fill();

  // Pixel surface blocks
  ctx.fillStyle = isFrozen ? '#ffffff' : biome.hazardLine;
  for (let i = 0; i <= wavePoints; i++) {
    const wx = i * step;
    const wy = (screenLavaY / scaleRatio) + Math.sin(wx * 0.05 + lavaWaveOffset * 2.0) * (biome.theme === 'ice' ? 6 : 4);
    pxFill(wx - 2, wy - 1, 5, 3, isFrozen ? '#ffffff' : biome.hazardLine);
  }

  // Theme sparkles
  if (!comfortMode) {
    for (let i = 0; i < 6; i++) {
      const sx = 30 + i * 70 + Math.sin(lavaWaveOffset + i) * 10;
      const sy = (screenLavaY / scaleRatio) - 8 - (i % 3) * 6;
      pxFill(sx, sy, 2, 2, biome.particle);
    }
  }

  ctx.restore();
}

function drawTrails() {
  trailSystem.draw(ctx, cameraY);
}

function drawPowerUps() {
  for (const p of powerUps) {
    if (p.collected) continue;
    const sy = (p.y - cameraY) * scaleRatio;
    if (sy < -40 || sy > canvas.height + 40) continue;

    p.pulse += 0.08;
    const hoverY = sy + Math.sin(p.pulse) * (4 * scaleRatio);
    const sx = p.x * scaleRatio;
    const info = POWER_UP_DATA[p.type] || { icon: '⚡', color: '#00f0ff' };

    ctx.save();
    ctx.strokeStyle = info.color;
    ctx.lineWidth = 2 * scaleRatio;
    ctx.beginPath();
    ctx.arc(sx, hoverY, 13 * scaleRatio, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.beginPath();
    ctx.arc(sx, hoverY, 12 * scaleRatio, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = `${13 * scaleRatio}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(info.icon, sx, hoverY + 1 * scaleRatio);
    ctx.restore();
  }
}

function drawFlyingEnemies() {
  for (const fe of flyingEnemies) {
    fe.draw(ctx, cameraY);
  }
}

function drawBossEnemies() {
  for (const b of bossEnemies) {
    b.draw(ctx, cameraY);
  }
}

function drawMysteryCrates() {
  for (const mc of mysteryCrates) {
    mc.draw(ctx, cameraY);
  }
}

function drawPlatforms() {
  for (const plat of platforms) {
    if (plat.broken) continue;

    const screenY = (plat.y - cameraY) * scaleRatio;
    if (screenY < -50 || screenY > canvas.height + 50) continue;

    const shakeOffset = (plat.shakeX || 0) * scaleRatio;
    const px = plat.x * scaleRatio + shakeOffset;
    const py = screenY;
    const pw = plat.width * scaleRatio;
    const ph = plat.height * scaleRatio;

    let mainColor = '#00e5ff';
    let darkColor = '#007799';
    let topTrimColor = '#b3f7ff';
    let glowColor = 'rgba(0, 229, 255, 0.5)';

    if (plat.type === PLATFORM_TYPES.BOOST) {
      mainColor = '#ff0055';
      darkColor = '#80002b';
      topTrimColor = '#ff80aa';
      glowColor = 'rgba(255, 0, 85, 0.65)';
    } else if (plat.type === PLATFORM_TYPES.SPRING) {
      mainColor = '#ffd000';
      darkColor = '#8c7200';
      topTrimColor = '#fff3a8';
      glowColor = 'rgba(255, 208, 0, 0.6)';
    } else if (plat.type === PLATFORM_TYPES.MOVING) {
      mainColor = '#b5179e';
      darkColor = '#5c004f';
      topTrimColor = '#f59feb';
      glowColor = 'rgba(181, 23, 158, 0.55)';
    } else if (plat.type === PLATFORM_TYPES.ICE) {
      mainColor = (plat.landed && plat.breakTimer % 4 < 2) ? '#ffffff' : '#72e2f8';
      darkColor = '#1c748c';
      topTrimColor = '#e0f9ff';
      glowColor = 'rgba(114, 226, 248, 0.6)';
    } else if (plat.type === PLATFORM_TYPES.PORTAL) {
      mainColor = '#a855f7';
      darkColor = '#581c87';
      topTrimColor = '#e9d5ff';
      glowColor = 'rgba(168, 85, 247, 0.65)';
    } else if (plat.type === PLATFORM_TYPES.WIND) {
      mainColor = '#06b6d4';
      darkColor = '#0e4a56';
      topTrimColor = '#cffafe';
      glowColor = 'rgba(6, 182, 212, 0.55)';
    } else if (plat.type === PLATFORM_TYPES.BOMB) {
      mainColor = plat.armed && Math.floor(gameTime * 2) % 2 === 0 ? '#ff1e40' : '#475569';
      darkColor = '#1e293b';
      topTrimColor = plat.armed ? '#ffa4b0' : '#94a3b8';
      glowColor = 'rgba(255, 30, 64, 0.55)';
    } else if (plat.type === PLATFORM_TYPES.GHOST) {
      mainColor = plat.isGhostActive ? 'rgba(168, 85, 247, 0.88)' : 'rgba(168, 85, 247, 0.22)';
      darkColor = plat.isGhostActive ? '#4c1d95' : 'rgba(76, 29, 149, 0.15)';
      topTrimColor = plat.isGhostActive ? '#d8b4fe' : 'rgba(216, 180, 254, 0.2)';
      glowColor = 'rgba(168, 85, 247, 0.35)';
    }

    const cornerR = 7 * scaleRatio;

    // 1. ALT 3D GÖLGE / KALIN TABAN (CHUNKY DEPTH DROP)
    ctx.fillStyle = darkColor;
    ctx.beginPath();
    ctx.roundRect(px, py + ph * 0.35, pw, ph * 0.65, [0, 0, cornerR, cornerR]);
    ctx.fill();

    // 2. ANA PLATFORM GÖVDESİ (CHUNKY SLAB)
    ctx.save();
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = lowFx ? 0 : 8 * scaleRatio;
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.roundRect(px, py, pw, ph * 0.75, [cornerR, cornerR, 3 * scaleRatio, 3 * scaleRatio]);
    ctx.fill();
    ctx.restore();

    // 3. ÜST KENAR NEON PARLAMA ÇİZGİSİ (NEON CAP STRIP)
    ctx.fillStyle = topTrimColor;
    ctx.beginPath();
    ctx.roundRect(px + 3 * scaleRatio, py + 1.5 * scaleRatio, pw - 6 * scaleRatio, 4 * scaleRatio, 2 * scaleRatio);
    ctx.fill();

    // 4. PLATFORM KENAR KORUYUCU DETAYLARI (BOLTS / INSETS)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(px + 8 * scaleRatio, py + 10 * scaleRatio, 2.2 * scaleRatio, 0, Math.PI * 2);
    ctx.arc(px + pw - 8 * scaleRatio, py + 10 * scaleRatio, 2.2 * scaleRatio, 0, Math.PI * 2);
    ctx.fill();

    // Özel Platform İkonları ve Detayları
    if (plat.type === PLATFORM_TYPES.ICE) {
      ctx.fillStyle = '#ffffff';
      const spikes = Math.max(4, Math.floor(plat.width / 22));
      for (let s = 0; s < spikes; s++) {
        const sx = px + (s + 0.5) * (pw / spikes);
        ctx.beginPath();
        ctx.moveTo(sx - 4 * scaleRatio, py + ph);
        ctx.lineTo(sx, py + ph + 9 * scaleRatio);
        ctx.lineTo(sx + 4 * scaleRatio, py + ph);
        ctx.fill();
      }
      if (plat.landed) {
        ctx.strokeStyle = '#05293d';
        ctx.lineWidth = 2 * scaleRatio;
        ctx.beginPath();
        ctx.moveTo(px + pw * 0.25, py);
        ctx.lineTo(px + pw * 0.38, py + ph);
        ctx.moveTo(px + pw * 0.65, py);
        ctx.lineTo(px + pw * 0.78, py + ph);
        ctx.stroke();
      }
    } else if (plat.type === PLATFORM_TYPES.SPRING) {
      // YAY MEKANİZMASI
      ctx.fillStyle = '#111827';
      const coils = 3;
      for (let c = 0; c < coils; c++) {
        const cx = px + pw * (0.32 + c * 0.18);
        ctx.fillRect(cx - 5 * scaleRatio, py + ph * 0.25, 10 * scaleRatio, 3 * scaleRatio);
        ctx.fillRect(cx - 5 * scaleRatio, py + ph * 0.55, 10 * scaleRatio, 3 * scaleRatio);
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(px + pw / 2, py - 6 * scaleRatio);
      ctx.lineTo(px + pw / 2 - 8 * scaleRatio, py + 3 * scaleRatio);
      ctx.lineTo(px + pw / 2 + 8 * scaleRatio, py + 3 * scaleRatio);
      ctx.closePath();
      ctx.fill();
    } else if (plat.type === PLATFORM_TYPES.BOOST) {
      // ROKET OKLARI
      ctx.fillStyle = '#ffffff';
      for (let a = 0; a < 2; a++) {
        const ay = py + 4 * scaleRatio + a * 7 * scaleRatio;
        ctx.beginPath();
        ctx.moveTo(px + pw / 2, ay);
        ctx.lineTo(px + pw / 2 - 10 * scaleRatio, ay + 6 * scaleRatio);
        ctx.lineTo(px + pw / 2 + 10 * scaleRatio, ay + 6 * scaleRatio);
        ctx.closePath();
        ctx.fill();
      }
    } else if (plat.type === PLATFORM_TYPES.MOVING) {
      // ÇİFT YÖNLÜ DİNAMİK OKLAR
      ctx.fillStyle = '#ffffff';
      const midY = py + ph / 2;
      ctx.beginPath();
      ctx.moveTo(px + 8 * scaleRatio, midY);
      ctx.lineTo(px + 17 * scaleRatio, midY - 5 * scaleRatio);
      ctx.lineTo(px + 17 * scaleRatio, midY + 5 * scaleRatio);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px + pw - 8 * scaleRatio, midY);
      ctx.lineTo(px + pw - 17 * scaleRatio, midY - 5 * scaleRatio);
      ctx.lineTo(px + pw - 17 * scaleRatio, midY + 5 * scaleRatio);
      ctx.closePath();
      ctx.fill();
    } else if (plat.type === PLATFORM_TYPES.PORTAL) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * scaleRatio;
      ctx.beginPath();
      ctx.ellipse(px + pw / 2, py + ph / 2, pw * 0.22, ph * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (plat.type === PLATFORM_TYPES.WIND) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * scaleRatio;
      ctx.beginPath();
      ctx.moveTo(px + 12 * scaleRatio, py + 6 * scaleRatio);
      ctx.quadraticCurveTo(px + pw * 0.45, py - 4 * scaleRatio, px + pw * 0.8, py + 8 * scaleRatio);
      ctx.stroke();
    } else if (plat.type === PLATFORM_TYPES.BOMB) {
      ctx.fillStyle = plat.armed && Math.floor(gameTime * 2) % 2 === 0 ? '#ffffff' : '#111827';
      ctx.beginPath();
      ctx.arc(px + pw / 2, py + ph / 2, 5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
    }

    // Kat Göstergesi
    if (plat.floor > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = `800 ${10 * scaleRatio}px Segoe UI, Trebuchet MS, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(`${plat.floor}F`, px + 8 * scaleRatio, py + ph - 5 * scaleRatio);
    }
  }

  // EN İYİ REKOR ÇİZGİSİ (PERSONAL BEST MARKER)
  if (bestScore > 3) {
    const recordPlat = platforms.find(p => p.floor === bestScore);
    const recY = recordPlat ? recordPlat.y : (platforms[0].y - bestScore * 72);
    const screenRecY = (recY - cameraY) * scaleRatio;

    if (screenRecY > -40 && screenRecY < canvas.height + 40) {
      ctx.save();
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 2.5 * scaleRatio;
      ctx.setLineDash([8 * scaleRatio, 6 * scaleRatio]);
      ctx.beginPath();
      ctx.moveTo(18 * scaleRatio, screenRecY);
      ctx.lineTo((VIRTUAL_WIDTH - 18) * scaleRatio, screenRecY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = `800 ${11 * scaleRatio}px Trebuchet MS, sans-serif`;
      ctx.fillStyle = '#ffe600';
      ctx.textAlign = 'right';
      ctx.fillText(`🚩 EN İYİ REKORUN: KAT ${bestScore}`, (VIRTUAL_WIDTH - 24) * scaleRatio, screenRecY - 6 * scaleRatio);
      ctx.restore();
    }
  }
}

function drawGems() {
  for (const g of gems) {
    if (g.collected) continue;

    const screenY = (g.y - cameraY) * scaleRatio;
    if (screenY < -30 || screenY > canvas.height + 30) continue;

    g.pulse += 0.08;
    const scale = 1 + Math.sin(g.pulse) * 0.15;
    const r = 8 * scale * scaleRatio;
    const gx = g.x * scaleRatio;

    ctx.fillStyle = '#00ffaa';
    ctx.beginPath();
    ctx.moveTo(gx, screenY - r);
    ctx.lineTo(gx + r, screenY);
    ctx.lineTo(gx, screenY + r);
    ctx.lineTo(gx - r, screenY);
    ctx.closePath();
    ctx.fill();

    // Minik ışıltı çekirdeği
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(gx, screenY, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ==========================================
// SLİME KARAKTER ÇİZİMİ (SLIME PLAYER)
// ==========================================
function drawPlayer() {
  const px = player.x * scaleRatio;
  const py = (player.y - cameraY) * scaleRatio;
  const pw = player.width * scaleRatio;
  const ph = player.height * scaleRatio;

  ctx.save();
  ctx.translate(px + pw / 2, py + ph / 2);
  ctx.rotate((player.rotation * Math.PI) / 180);
  ctx.scale(player.scaleX, player.scaleY);

  const bodyColor = shop.getCharColor(gameTime, player.vx, player.maxSpeed);

  const shapeItem = shop.getEquippedItem('charShape');
  const isSlime = shapeItem ? shapeItem.preview === 'slime' : false;

  ctx.fillStyle = bodyColor;

  const halfW = pw / 2;
  const halfH = ph / 2;

  if (isSlime) {
    // ---- SLIME BLOB GÖVDESİ ----
    const wobble = Math.sin(gameTime * 6) * 1.5 * scaleRatio;
    ctx.beginPath();
    ctx.moveTo(-halfW + 4 * scaleRatio, halfH);
    ctx.bezierCurveTo(
      -halfW - 2 * scaleRatio, -wobble,
      -halfW + 6 * scaleRatio, -halfH - 3 * scaleRatio,
      0, -halfH - 5 * scaleRatio + wobble
    );
    ctx.bezierCurveTo(
      halfW - 6 * scaleRatio, -halfH - 3 * scaleRatio,
      halfW + 2 * scaleRatio, -wobble,
      halfW - 4 * scaleRatio, halfH
    );
    ctx.bezierCurveTo(
      halfW - 8 * scaleRatio, halfH + 3 * scaleRatio,
      -halfW + 8 * scaleRatio, halfH + 3 * scaleRatio,
      -halfW + 4 * scaleRatio, halfH
    );
    ctx.closePath();
    ctx.fill();

    // İç parlama (highlight)
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-2 * scaleRatio, -halfH * 0.3, halfW * 0.4, halfH * 0.25, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else {
    // ---- KLASİK KUTU (DİKDÖRTGEN) ----
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, pw, ph, 8 * scaleRatio);
    ctx.fill();
  }

  // ---- GÖZLER ----
  drawEyes(ctx, pw, ph);

  // ---- ŞAPKA ----
  drawHat(ctx, pw, ph);

  // ---- KOZMİK SÜPERSTAR AYDINLATMASI ----
  if (shop.getEquipped('charColor') === 'char_cosmic') {
    ctx.strokeStyle = `hsl(${(gameTime * 75) % 360}, 100%, 75%)`;
    ctx.lineWidth = 2 * scaleRatio;
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(halfW, halfH) * 1.25, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ---- AKTİF GÜÇLENDİRİCİ GÖRSELLERİ (KALKAN & JETPACK & MANYETİK HALE) ----
  if (activePowerUp && activePowerUp.type === 'shield') {
    const shieldPulse = Math.sin(gameTime * 8) * 2 * scaleRatio;
    const shieldRadius = Math.max(halfW, halfH) * 1.45 + shieldPulse;

    ctx.save();
    ctx.shadowColor = '#ff007f';
    ctx.shadowBlur = 12 * scaleRatio;
    ctx.strokeStyle = '#ff007f';
    ctx.lineWidth = 3 * scaleRatio;
    ctx.beginPath();
    ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 0, 127, 0.22)';
    ctx.beginPath();
    ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
    ctx.fill();

    // Kalkan petek / parlama deseni
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5 * scaleRatio;
    ctx.beginPath();
    ctx.arc(-shieldRadius * 0.35, -shieldRadius * 0.35, shieldRadius * 0.45, Math.PI * 0.9, Math.PI * 1.8);
    ctx.stroke();
    ctx.restore();
  } else if (activePowerUp && activePowerUp.type === 'jetpack') {
    // İki Yönlü Turbo Roket Motoru Çizimi
    ctx.save();
    // Motor Gövdesi
    ctx.fillStyle = '#334155';
    ctx.fillRect(-halfW - 4 * scaleRatio, -halfH * 0.2, 5 * scaleRatio, halfH * 0.9);
    ctx.fillRect(halfW - 1 * scaleRatio, -halfH * 0.2, 5 * scaleRatio, halfH * 0.9);

    // Motor Alevleri
    const flameH1 = (14 + Math.random() * 12) * scaleRatio;
    const flameH2 = (14 + Math.random() * 12) * scaleRatio;

    // Sol Alev
    ctx.fillStyle = Math.random() > 0.4 ? '#ffe600' : '#ff3700';
    ctx.beginPath();
    ctx.moveTo(-halfW - 4 * scaleRatio, halfH * 0.7);
    ctx.lineTo(-halfW - 1.5 * scaleRatio, halfH * 0.7 + flameH1);
    ctx.lineTo(-halfW + 1 * scaleRatio, halfH * 0.7);
    ctx.closePath();
    ctx.fill();

    // Sağ Alev
    ctx.beginPath();
    ctx.moveTo(halfW - 1 * scaleRatio, halfH * 0.7);
    ctx.lineTo(halfW + 1.5 * scaleRatio, halfH * 0.7 + flameH2);
    ctx.lineTo(halfW + 4 * scaleRatio, halfH * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  } else if (activePowerUp && activePowerUp.type === 'magnet') {
    // Mıknatıs Çekim Halesi
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.65)';
    ctx.lineWidth = 2 * scaleRatio;
    ctx.setLineDash([6 * scaleRatio, 4 * scaleRatio]);
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(halfW, halfH) * 1.35, gameTime * 4, gameTime * 4 + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  ctx.restore();
}

function drawEyes(ctx, pw, ph) {
  const eyeType = shop.getEquippedItem('eyes').preview;
  const eyeDir = player.vx > 0.5 ? 1 : (player.vx < -0.5 ? -1 : 0);
  const eyeOffsetX = eyeDir * 3 * scaleRatio;

  switch (eyeType) {
    case 'angry': {
      // Kızgın gözler — açılı kaşlarla
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4 * scaleRatio + eyeOffsetX, -4 * scaleRatio, 4.5 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(6 * scaleRatio + eyeOffsetX, -4 * scaleRatio, 4.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(-3 * scaleRatio + eyeOffsetX * 1.3, -4 * scaleRatio, 2.2 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(7 * scaleRatio + eyeOffsetX * 1.3, -4 * scaleRatio, 2.2 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      // Kaşlar
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * scaleRatio;
      ctx.beginPath();
      ctx.moveTo(-8 * scaleRatio, -10 * scaleRatio);
      ctx.lineTo(-1 * scaleRatio, -8 * scaleRatio);
      ctx.moveTo(10 * scaleRatio, -10 * scaleRatio);
      ctx.lineTo(3 * scaleRatio, -8 * scaleRatio);
      ctx.stroke();
      break;
    }
    case 'happy': {
      // Mutlu gözler — kapalı göz çizgileri
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5 * scaleRatio;
      ctx.lineCap = 'round';
      // Sol göz (gülen eğri)
      ctx.beginPath();
      ctx.arc(-4 * scaleRatio + eyeOffsetX, -3 * scaleRatio, 4 * scaleRatio, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      // Sağ göz
      ctx.beginPath();
      ctx.arc(6 * scaleRatio + eyeOffsetX, -3 * scaleRatio, 4 * scaleRatio, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();
      break;
    }
    case 'sunglasses': {
      // Güneş gözlüğü
      ctx.fillStyle = '#1a1a2e';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5 * scaleRatio;
      // Sol cam
      ctx.beginPath();
      ctx.roundRect(-10 * scaleRatio + eyeOffsetX, -8 * scaleRatio, 9 * scaleRatio, 7 * scaleRatio, 2 * scaleRatio);
      ctx.fill();
      ctx.stroke();
      // Sağ cam
      ctx.beginPath();
      ctx.roundRect(1 * scaleRatio + eyeOffsetX, -8 * scaleRatio, 9 * scaleRatio, 7 * scaleRatio, 2 * scaleRatio);
      ctx.fill();
      ctx.stroke();
      // Köprü
      ctx.beginPath();
      ctx.moveTo(-1 * scaleRatio + eyeOffsetX, -5 * scaleRatio);
      ctx.lineTo(1 * scaleRatio + eyeOffsetX, -5 * scaleRatio);
      ctx.stroke();
      // Parlama
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(-8 * scaleRatio + eyeOffsetX, -7 * scaleRatio, 3 * scaleRatio, 2 * scaleRatio);
      ctx.fillRect(3 * scaleRatio + eyeOffsetX, -7 * scaleRatio, 3 * scaleRatio, 2 * scaleRatio);
      break;
    }
    case 'patch': {
      // Göz bandı — sol göz kapalı
      // Sağ göz normal
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(6 * scaleRatio + eyeOffsetX, -4 * scaleRatio, 4.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(7 * scaleRatio + eyeOffsetX * 1.3, -4 * scaleRatio, 2 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      // Sol göz bandı
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(-4 * scaleRatio, -4 * scaleRatio, 5.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      // Bant çizgisi
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 1.5 * scaleRatio;
      ctx.beginPath();
      ctx.moveTo(-9 * scaleRatio, -8 * scaleRatio);
      ctx.lineTo(10 * scaleRatio, -10 * scaleRatio);
      ctx.stroke();
      break;
    }
    case 'cyclops': {
      // Tek büyük göz ortada
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(1 * scaleRatio + eyeOffsetX, -4 * scaleRatio, 7 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(2 * scaleRatio + eyeOffsetX * 1.3, -4 * scaleRatio, 3.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      // Parlama
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc(-1 * scaleRatio + eyeOffsetX, -7 * scaleRatio, 2 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'laser': {
      // Robotik Lazer Vizörü
      ctx.fillStyle = '#111827';
      ctx.fillRect(-10 * scaleRatio + eyeOffsetX, -7 * scaleRatio, 20 * scaleRatio, 6 * scaleRatio);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1 * scaleRatio;
      ctx.strokeRect(-10 * scaleRatio + eyeOffsetX, -7 * scaleRatio, 20 * scaleRatio, 6 * scaleRatio);

      // Kırmızı lazer göz ışıması
      ctx.fillStyle = '#ff0033';
      const scanX = Math.sin(gameTime * 10) * 6 * scaleRatio;
      ctx.fillRect(scanX + eyeOffsetX - 2 * scaleRatio, -6 * scaleRatio, 4 * scaleRatio, 4 * scaleRatio);
      break;
    }
    default: {
      // Normal gözler (varsayılan)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-4 * scaleRatio + eyeOffsetX, -4 * scaleRatio, 4.5 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(6 * scaleRatio + eyeOffsetX, -4 * scaleRatio, 4.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(-3 * scaleRatio + eyeOffsetX * 1.3, -4 * scaleRatio, 2 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(7 * scaleRatio + eyeOffsetX * 1.3, -4 * scaleRatio, 2 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

function drawHat(ctx, pw, ph) {
  const hatType = shop.getEquippedItem('hats').preview;
  const halfW = pw / 2;
  const halfH = ph / 2;

  switch (hatType) {
    case 'crown': {
      // Altın taç
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.7, -halfH - 2 * scaleRatio);
      ctx.lineTo(-halfW * 0.55, -halfH - 14 * scaleRatio);
      ctx.lineTo(-halfW * 0.2, -halfH - 6 * scaleRatio);
      ctx.lineTo(0, -halfH - 16 * scaleRatio);
      ctx.lineTo(halfW * 0.2, -halfH - 6 * scaleRatio);
      ctx.lineTo(halfW * 0.55, -halfH - 14 * scaleRatio);
      ctx.lineTo(halfW * 0.7, -halfH - 2 * scaleRatio);
      ctx.closePath();
      ctx.fill();
      // Mücevher noktaları
      ctx.fillStyle = '#ff0044';
      ctx.beginPath();
      ctx.arc(0, -halfH - 12 * scaleRatio, 2 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#00ccff';
      ctx.beginPath();
      ctx.arc(-halfW * 0.4, -halfH - 9 * scaleRatio, 1.5 * scaleRatio, 0, Math.PI * 2);
      ctx.arc(halfW * 0.4, -halfH - 9 * scaleRatio, 1.5 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'party': {
      // Parti şapkası (koni)
      ctx.fillStyle = '#ff007f';
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.4, -halfH - 2 * scaleRatio);
      ctx.lineTo(0, -halfH - 22 * scaleRatio);
      ctx.lineTo(halfW * 0.4, -halfH - 2 * scaleRatio);
      ctx.closePath();
      ctx.fill();
      // Çizgiler
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 1.5 * scaleRatio;
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.25, -halfH - 6 * scaleRatio);
      ctx.lineTo(halfW * 0.05, -halfH - 16 * scaleRatio);
      ctx.moveTo(-halfW * 0.1, -halfH - 4 * scaleRatio);
      ctx.lineTo(halfW * 0.2, -halfH - 12 * scaleRatio);
      ctx.stroke();
      // Ponpon
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(0, -halfH - 22 * scaleRatio, 3 * scaleRatio, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'ninja': {
      // Ninja bandı
      ctx.fillStyle = '#222';
      ctx.fillRect(-halfW * 0.85, -halfH - 5 * scaleRatio, pw * 0.85, 6 * scaleRatio);
      // Kuyruklar
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 3 * scaleRatio;
      ctx.beginPath();
      ctx.moveTo(halfW * 0.6, -halfH - 2 * scaleRatio);
      ctx.bezierCurveTo(halfW + 5 * scaleRatio, -halfH - 4 * scaleRatio, halfW + 8 * scaleRatio, -halfH + 2 * scaleRatio, halfW + 12 * scaleRatio, -halfH - 6 * scaleRatio);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(halfW * 0.6, -halfH - 4 * scaleRatio);
      ctx.bezierCurveTo(halfW + 3 * scaleRatio, -halfH - 8 * scaleRatio, halfW + 7 * scaleRatio, -halfH - 2 * scaleRatio, halfW + 10 * scaleRatio, -halfH - 10 * scaleRatio);
      ctx.stroke();
      break;
    }
    case 'helmet': {
      // Baret / İnşaat bareti
      ctx.fillStyle = '#ff8800';
      ctx.beginPath();
      ctx.ellipse(0, -halfH - 3 * scaleRatio, halfW * 0.85, 5 * scaleRatio, 0, Math.PI, 0);
      ctx.fill();
      // Üst kabarık kısım
      ctx.beginPath();
      ctx.ellipse(0, -halfH - 6 * scaleRatio, halfW * 0.55, 8 * scaleRatio, 0, Math.PI, 0);
      ctx.fill();
      // Şerit
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(-halfW * 0.55, -halfH - 4 * scaleRatio, pw * 0.55, 2 * scaleRatio);
      break;
    }
    case 'flower': {
      // Çiçek
      const cx = halfW * 0.3;
      const cy = -halfH - 6 * scaleRatio;
      const petalR = 4 * scaleRatio;
      // Sap
      ctx.strokeStyle = '#22cc44';
      ctx.lineWidth = 2 * scaleRatio;
      ctx.beginPath();
      ctx.moveTo(cx, -halfH);
      ctx.lineTo(cx, cy);
      ctx.stroke();
      // Yapraklar
      ctx.fillStyle = '#ff69b4';
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(angle) * petalR, cy + Math.sin(angle) * petalR, petalR * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      // Merkez
      ctx.fillStyle = '#ffe600';
      ctx.beginPath();
      ctx.arc(cx, cy, petalR * 0.45, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'halo': {
      // Melek Halesi (Altın Işıltılı Halka)
      ctx.strokeStyle = '#ffe600';
      ctx.lineWidth = 2.5 * scaleRatio;
      const floatY = Math.sin(gameTime * 4) * 2 * scaleRatio;
      ctx.beginPath();
      ctx.ellipse(0, -halfH - 14 * scaleRatio + floatY, halfW * 0.75, 4 * scaleRatio, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    default:
      // Şapka yok
      break;
  }
}

function loop() {
  try {
    update();
    draw();
  } catch (err) {
    console.error('frame', err);
  }
  requestAnimationFrame(loop);
}

// ==========================================
// DOKUNMATİK & ÇOKLU DOKUNUŞ BAĞLANTILARI
// ==========================================
function bindTouchButton(btn, onDown, onUp) {
  if (!btn) return;
  let isDown = false;

  const start = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (isDown) return;
    isDown = true;
    btn.classList.add('active');
    onDown();
  };

  const end = (e) => {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    if (!isDown) return;
    isDown = false;
    btn.classList.remove('active');
    onUp();
  };

  // Android WebView: touch* en güvenilir; pointer yedek
  btn.addEventListener('touchstart', start, { passive: false });
  btn.addEventListener('touchend', end, { passive: false });
  btn.addEventListener('touchcancel', end, { passive: false });
  btn.addEventListener('mousedown', start);
  btn.addEventListener('mouseup', end);
  btn.addEventListener('mouseleave', end);
  btn.addEventListener('pointerdown', start, { passive: false });
  btn.addEventListener('pointerup', end, { passive: false });
  btn.addEventListener('pointercancel', end, { passive: false });
}

function applySplitSteer(clientX) {
  const mid = window.innerWidth / 2;
  const onRight = clientX >= mid;
  const goRight = touchLayoutSwapped ? !onRight : onRight;
  inputLeft = !goRight;
  inputRight = goRight;
}

function clearSplitSteer() {
  inputLeft = false;
  inputRight = false;
}

function bindSplitHalf(el) {
  if (!el) return;
  const down = (e) => {
    if (currentState !== GAME_STATE.PLAYING) return;
    if (e.cancelable) e.preventDefault();
    const x = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : midFallback(e));
    applySplitSteer(x);
    sounds.init();
    checkWallKickOnInput(true);
  };
  const move = (e) => {
    if (currentState !== GAME_STATE.PLAYING) return;
    if (!e.buttons && e.type === 'mousemove') return;
    const t = e.touches ? e.touches[0] : e;
    if (!t) return;
    applySplitSteer(t.clientX);
  };
  const up = () => clearSplitSteer();
  el.addEventListener('touchstart', down, { passive: false });
  el.addEventListener('touchmove', move, { passive: false });
  el.addEventListener('touchend', up, { passive: false });
  el.addEventListener('touchcancel', up, { passive: false });
  el.addEventListener('pointerdown', down, { passive: false });
  el.addEventListener('pointermove', move, { passive: false });
  el.addEventListener('pointerup', up, { passive: false });
  el.addEventListener('pointercancel', up, { passive: false });
}

function midFallback() {
  return window.innerWidth / 2;
}

bindSplitHalf(btnLeft);
bindSplitHalf(btnRight);

const splitLayer = document.getElementById('touchControls');
if (splitLayer) {
  splitLayer.addEventListener('touchmove', (e) => {
    if (currentState !== GAME_STATE.PLAYING) return;
    if (e.cancelable) e.preventDefault();
    if (e.touches && e.touches[0]) applySplitSteer(e.touches[0].clientX);
  }, { passive: false });
}

// PC Klavye Desteği (yeniden atanabilir tuşlar)
window.addEventListener('keydown', (e) => {
  if (pendingBindAction) {
    e.preventDefault();
    finishKeybindListen(e.code);
    return;
  }

  sounds.init();
  if (currentState === GAME_STATE.START && (e.code === keybinds.jump || e.code === 'Enter')) {
    startGame();
    return;
  }
  if (e.code === keybinds.left) inputLeft = true;
  if (e.code === keybinds.right) inputRight = true;
  if (e.code === keybinds.jump && currentState === GAME_STATE.PLAYING) {
    doJump();
  }
  if (e.code === keybinds.pause) {
    if (currentState === GAME_STATE.PLAYING) openPauseMenu();
    else if (currentState === GAME_STATE.PAUSED) closePauseMenu();
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === keybinds.left) inputLeft = false;
  if (e.code === keybinds.right) inputRight = false;
});

// ==========================================
// MENÜ VE MAĞAZA BUTON BAĞLANTILARI
// ==========================================
const bindFastClick = (btn, action) => {
  if (!btn) return;
  let lastFire = 0;
  const fire = (e) => {
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }
    const now = Date.now();
    if (now - lastFire < 280) return;
    lastFire = now;
    try { action(); } catch (err) { console.error(err); }
  };

  btn.addEventListener('touchstart', fire, { passive: false });
  btn.addEventListener('mousedown', fire);
  btn.addEventListener('click', fire);
};

// HTML onclick / global erişim (WebView yedek yolu)
let lastStartCall = 0;
window.__towerKickStart = () => {
  const now = Date.now();
  if (now - lastStartCall < 350) return;
  lastStartCall = now;
  requestStartGame();
};
let lastShopCall = 0;
window.__towerKickShop = () => {
  const now = Date.now();
  if (now - lastShopCall < 350) return;
  lastShopCall = now;
  openShop();
};
let lastSettingsCall = 0;
window.__towerKickSettings = () => {
  const now = Date.now();
  if (now - lastSettingsCall < 350) return;
  lastSettingsCall = now;
  openSettings();
};
let lastScoresCall = 0;
window.__towerKickScores = () => {
  const now = Date.now();
  if (now - lastScoresCall < 350) return;
  lastScoresCall = now;
  openScores();
};

if (menuBtn) {
  bindFastClick(menuBtn, () => {
    if (currentState === GAME_STATE.PLAYING) openPauseMenu();
    else if (currentState === GAME_STATE.PAUSED) closePauseMenu();
  });
}

if (resumeBtn) {
  bindFastClick(resumeBtn, () => closePauseMenu());
}

if (inGameRestartBtn) {
  bindFastClick(inGameRestartBtn, () => restartToFloorZero());
}

if (mainMenuBtn) {
  bindFastClick(mainMenuBtn, () => goToMainMenu());
}

bindFastClick(playBtn, () => requestStartGame());
bindFastClick(restartBtn, () => startGame());
bindFastClick(tutorialOkBtn, () => finishTutorial());
bindFastClick(dailyGiftBtn, () => claimDailyGift());
bindFastClick(gameOverMenuBtn, () => goToMainMenu());

if (soundBtn) {
  bindFastClick(soundBtn, () => {
    sounds.enabled = !sounds.enabled;
    localStorage.setItem('towerkick_sfx', sounds.enabled ? '1' : '0');
    soundBtn.textContent = sounds.enabled ? '🔊' : '🔇';
  });
}

if (comfortBtn) {
  bindFastClick(comfortBtn, () => {
    comfortMode = !comfortMode;
    localStorage.setItem('towerkick_comfort', comfortMode ? '1' : '0');
    if (comfortMode) {
      document.body.classList.add('comfort-mode');
      comfortBtn.textContent = '☀️';
      floatingTexts.push(new FloatingText("GÖZ KORUMA MODU: AÇIK 🌙", VIRTUAL_WIDTH / 2, player.y - 30, '#ffe600'));
    } else {
      document.body.classList.remove('comfort-mode');
      comfortBtn.textContent = '🌙';
      floatingTexts.push(new FloatingText("GÖZ KORUMA MODU: KAPALI ☀️", VIRTUAL_WIDTH / 2, player.y - 30, '#00f0ff'));
    }
  });
}

if (reviveBtn) {
  bindFastClick(reviveBtn, () => {
    if (!canFreeRevive()) {
      floatingTexts.push(new FloatingText("Yarın tekrar 1 hak", VIRTUAL_WIDTH / 2, player.y - 24, '#ffaa00'));
      return;
    }
    pendingRunRecord = false;
    localStorage.setItem(REVIVE_KEY, getTodayString());
    updateReviveUI();
    gameOverOverlay.classList.add('hidden');
    lavaY = player.y + 400;
    player.vy = -22.0;
    player.isGrounded = false;
    isDeadByLava = false;
    currentState = GAME_STATE.PLAYING;
    document.body.classList.add('playing');
    sounds.spring();
    sounds.doubleJump();
    sounds.startBGM();
    floatingTexts.push(new FloatingText("DİRİLDİN! 🚀", player.x + player.width / 2, player.y - 20, '#ffe600'));
    emitParticles(player.x + player.width / 2, player.y, 16, '#ffe600', 7);
  });
}

// MAĞAZA BUTONLARI
bindFastClick(shopBtn, () => openShop());
bindFastClick(shopCloseBtn, () => closeShop());
bindFastClick(settingsBtn, () => openSettings());
bindFastClick(settingsCloseBtn, () => closeSettings());
bindFastClick(bgmToggleBtn, () => toggleBGMSetting());
bindFastClick(sfxToggleBtn, () => toggleSFXSetting());
bindFastClick(hapticToggleBtn, () => toggleHapticSetting());
bindFastClick(speedToggleBtn, () => toggleSpeedSetting());
bindFastClick(lowFxToggleBtn, () => toggleLowFxSetting());
bindFastClick(scoresBtn, () => openScores());
bindFastClick(scoresCloseBtn, () => closeScores());

// Kategori Tabları
categoryTabs.forEach(tab => {
  bindFastClick(tab, () => {
    categoryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    shop.currentCategory = tab.dataset.category;
    shop.renderShop();
  });
});

// ==========================================
// OYUN MODU SEÇİCİ VE GÖREV ETKİLEŞİMLERİ
// ==========================================
modeButtons.forEach(btn => {
  if (btn.dataset.mode === selectedMode) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }

  bindFastClick(btn, () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedMode = btn.dataset.mode;
    localStorage.setItem('towerkick_mode', selectedMode);
    sounds.jump(false);
    vibrate(15);
    if (selectedMode === GAME_MODES.LEVELS) {
      openLevels();
    }
  });
});

if (questBtn) {
  questBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openQuests();
  });
}

if (pauseQuestBtn) {
  pauseQuestBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openQuests();
  });
}

if (questCloseBtn) {
  questCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeQuests();
  });
}

// ==========================================
// ŞANS ÇARKI ETKİLEŞİMLERİ
// ==========================================
if (wheelBtn) {
  wheelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openWheel();
  });
}

if (wheelCloseBtn) {
  wheelCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWheel();
  });
}

if (spinBtn) {
  spinBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    spinWheel();
  });
}

// ==========================================
// AYARLAR MENÜSÜ ETKİLEŞİMLERİ (ekstra: tuş / ödüller)
// ==========================================
if (touchLayoutBtn) {
  bindFastClick(touchLayoutBtn, () => toggleTouchLayout());
}

[bindLeftBtn, bindRightBtn, bindJumpBtn, bindPauseBtn].forEach((btn) => {
  if (!btn) return;
  bindFastClick(btn, () => startKeybindListen(btn.dataset.bind));
});

if (resetBindsBtn) {
  bindFastClick(resetBindsBtn, () => resetKeybinds());
}

if (settingsQuestBtn) {
  bindFastClick(settingsQuestBtn, () => {
    closeSettings();
    openQuests();
  });
}
if (settingsStreakBtn) {
  bindFastClick(settingsStreakBtn, () => {
    closeSettings();
    openStreak();
  });
}
if (settingsWheelBtn) {
  bindFastClick(settingsWheelBtn, () => {
    closeSettings();
    openWheel();
  });
}

// ==========================================
// BÖLÜMLER MODU ETKİLEŞİMLERİ
// ==========================================
if (levelsCloseBtn) {
  levelsCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeLevels();
  });
}

if (nextLevelBtn) {
  nextLevelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (levelClearOverlay) levelClearOverlay.classList.add('hidden');
    currentLevelId = Math.min(currentLevelId + 1, STAGES.length);
    startLevel(currentLevelId);
  });
}

if (levelClearMenuBtn) {
  levelClearMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (levelClearOverlay) levelClearOverlay.classList.add('hidden');
    openLevels();
  });
}

// ==========================================
// GÜNLÜK SERİ MODALI ETKİLEŞİMLERİ
// ==========================================
if (streakBtn) {
  streakBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openStreak();
  });
}

if (streakCloseBtn) {
  streakCloseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeStreak();
  });
}

if (claimStreakBtn) {
  claimStreakBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    claimStreakReward();
  });
}

// Başlangıç Yüklemeleri
loadQuests();
loadStreakData();
applyTouchLayout();
updateSettingsUI();
updateWheelStatus();
renderLevels();
refreshDailyGift();
updateReviveUI();
initPlatforms(); // Menü arkasında kule görünsün
hideBootSplash(false);
setTimeout(() => hideBootSplash(true), 1200);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  }).catch(() => {});
}
if (window.caches) {
  caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))).catch(() => {});
}

// ==========================================
// MOBİL UYGULAMA (APP) NATIVE ENTEGRASYONU
// ==========================================

// 1. Android Donanım & Kaydırma Geri (Back) Tuşu Yönetimi
function handleNativeBackButton() {
  // Açık modal varsa kapat
  if (scoresOverlay && !scoresOverlay.classList.contains('hidden')) {
    closeScores();
    return true;
  }
  if (tutorialOverlay && !tutorialOverlay.classList.contains('hidden')) {
    tutorialOverlay.classList.add('hidden');
    if (startOverlay) startOverlay.classList.remove('hidden');
    currentState = GAME_STATE.START;
    return true;
  }
  if (shopOverlay && !shopOverlay.classList.contains('hidden')) {
    closeShop();
    return true;
  }
  if (questOverlay && !questOverlay.classList.contains('hidden')) {
    closeQuests();
    return true;
  }
  if (streakOverlay && !streakOverlay.classList.contains('hidden')) {
    closeStreak();
    return true;
  }
  if (wheelOverlay && !wheelOverlay.classList.contains('hidden')) {
    closeWheel();
    return true;
  }
  if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
    closeSettings();
    return true;
  }
  if (levelsOverlay && !levelsOverlay.classList.contains('hidden')) {
    closeLevels();
    return true;
  }
  if (levelClearOverlay && !levelClearOverlay.classList.contains('hidden')) {
    levelClearOverlay.classList.add('hidden');
    openLevels();
    return true;
  }
  if (gameOverOverlay && !gameOverOverlay.classList.contains('hidden')) {
    goToMainMenu();
    return true;
  }

  // Duraklatma ekranındaysa oyuna devam et
  if (currentState === GAME_STATE.PAUSED && pauseOverlay && !pauseOverlay.classList.contains('hidden')) {
    closePauseMenu();
    return true;
  }

  // Oyun oynanıyorsa duraklat
  if (currentState === GAME_STATE.PLAYING) {
    openPauseMenu();
    return true;
  }

  // Ana menüdeyse uygulamadan temiz çıkış yap
  if (currentState === GAME_STATE.START) {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
      window.Capacitor.Plugins.App.exitApp();
    } else if (navigator.app && navigator.app.exitApp) {
      navigator.app.exitApp();
    }
    return true;
  }
  return false;
}

document.addEventListener('backbutton', (e) => {
  e.preventDefault();
  handleNativeBackButton();
}, false);

if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
  window.Capacitor.Plugins.App.addListener('backButton', () => {
    handleNativeBackButton();
  });
}

// 2. Mobil Yaşam Döngüsü (App Lifecycle - Arka plana geçince duraklat & sessize al)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    sounds.stopBGM();
    if (currentState === GAME_STATE.PLAYING) {
      openPauseMenu();
    }
  } else {
    sounds.init();
    if (currentState === GAME_STATE.PLAYING && sounds.bgmEnabled) {
      sounds.startBGM();
    }
  }
});

if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
  window.Capacitor.Plugins.App.addListener('appStateChange', (state) => {
    if (!state.isActive) {
      sounds.stopBGM();
      if (currentState === GAME_STATE.PLAYING) {
        openPauseMenu();
      }
    } else {
      sounds.init();
      if (currentState === GAME_STATE.PLAYING && sounds.bgmEnabled) {
        sounds.startBGM();
      }
    }
  });
}

// 3. Mobil Dokunma İyileştirmesi: Uzun basışta sağ tık / bağlam menüsünü engelle
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
}, { passive: false });

// Tüm ekranı kaplayan yedek tıklama: buton id'sine göre çalışır
(function bindGlobalUiClicks() {
  const runById = (id) => {
    if (id === 'playBtn') { requestStartGame(); return true; }
    if (id === 'restartBtn') { startGame(); return true; }
    if (id === 'shopBtn') { openShop(); return true; }
    if (id === 'settingsBtn') { openSettings(); return true; }
    if (id === 'scoresBtn') { openScores(); return true; }
    if (id === 'scoresCloseBtn') { closeScores(); return true; }
    if (id === 'shopCloseBtn') { closeShop(); return true; }
    if (id === 'settingsCloseBtn') { closeSettings(); return true; }
    if (id === 'resumeBtn') { closePauseMenu(); return true; }
    if (id === 'mainMenuBtn') { goToMainMenu(); return true; }
    if (id === 'inGameRestartBtn') { restartToFloorZero(); return true; }
    return false;
  };

  const onUiTap = (e) => {
    const t = e.target && e.target.closest ? e.target.closest('button, .mode-btn, .menu-nav-btn, .primary-btn') : null;
    if (!t || !t.id) return;
    if (runById(t.id)) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }
  };

  document.addEventListener('touchstart', onUiTap, { passive: false, capture: true });
  document.addEventListener('click', onUiTap, true);
})();

loop();


