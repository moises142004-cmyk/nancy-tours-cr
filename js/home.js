// Nancy Tours Costa Rica — Home page interactives
// =====================================================================
// Page-specific JS. Shared chrome (mobile menu, lang switcher) is in
// chrome.js. This file handles:
//   1. Hero video crossfade (hide native loop seam)
//   2. Value-card 3D tilt + radial specular highlight
//   3. Jungle audio chip — procedural birds + wind via Web Audio

(function () {
  'use strict';

  // ── 1. Hero video crossfade ─────────────────────────────────────────
  function initHeroVideo() {
    const videos = document.querySelectorAll('[data-hero-video]');
    if (videos.length < 2) return;
    const a = videos[0], b = videos[1];
    let active = 1;
    let ready = false;
    const FADE = 0.6;

    const setActive = (which) => {
      active = which;
      a.classList.toggle('is-active', ready && active === 1);
      b.classList.toggle('is-active', ready && active === 2);
    };

    const onCanPlay = () => {
      if (ready) return;
      ready = true;
      setActive(1);
    };
    a.addEventListener('canplay', onCanPlay);
    b.addEventListener('canplay', onCanPlay);

    const tick = () => {
      const cur = active === 1 ? a : b;
      const other = active === 1 ? b : a;
      if (cur && other && cur.duration && !isNaN(cur.duration)) {
        const remaining = cur.duration - cur.currentTime;
        if (remaining < FADE && other.paused) {
          other.currentTime = 0;
          other.play().catch(() => {});
          setActive(active === 1 ? 2 : 1);
        }
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ── 2. Value-card tilt + specular ────────────────────────────────────
  function initValueCards() {
    const cards = document.querySelectorAll('.nt-value-card[data-tilt]');
    cards.forEach((card) => {
      const shell = card.querySelector('.nt-value-shell');
      const spec = card.querySelector('.nt-specular');
      if (!shell || !spec) return;

      const onMove = (e) => {
        const r = shell.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        const rx = (y - 0.5) * -10;
        const ry = (x - 0.5) * 10;
        shell.style.setProperty('--rx', rx + 'deg');
        shell.style.setProperty('--ry', ry + 'deg');
        spec.style.setProperty('--mx', (x * 100) + '%');
        spec.style.setProperty('--my', (y * 100) + '%');
      };
      const onEnter = () => card.setAttribute('data-active', '1');
      const onLeave = () => {
        card.removeAttribute('data-active');
        shell.style.setProperty('--rx', '0deg');
        shell.style.setProperty('--ry', '0deg');
        spec.style.setProperty('--mx', '50%');
        spec.style.setProperty('--my', '50%');
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
    });
  }

  // ── 3. Jungle audio chip ────────────────────────────────────────────
  function initJungleChip() {
    const chip = document.querySelector('.nt-video-chip');
    if (!chip) return;
    const live = chip.querySelector('.nt-chip-live');
    const playBtn = chip.querySelector('.nt-chip-play');
    const label = chip.querySelector('.nt-chip-label');
    const scrubFill = chip.querySelector('.nt-chip-scrub-fill');

    let ctx = null;
    let nodes = null;
    let raf = null;
    let birdTimer = null;
    let playing = false;
    let progress = 36;

    const stop = () => {
      if (birdTimer) { clearTimeout(birdTimer); birdTimer = null; }
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (nodes && ctx) {
        try { nodes.master.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.4); } catch (e) {}
      }
      setTimeout(() => {
        if (ctx) {
          try { ctx.close(); } catch (e) {}
          ctx = null;
          nodes = null;
        }
      }, 500);
    };

    const start = () => {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();

      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 0.6);
      master.connect(ctx.destination);

      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.18;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 700;
      noiseFilter.Q.value = 0.6;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.32;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.12;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 380;
      lfo.connect(lfoGain).connect(noiseFilter.frequency);
      noise.connect(noiseFilter).connect(noiseGain).connect(master);
      noise.start();
      lfo.start();

      const birdBus = ctx.createGain();
      birdBus.gain.value = 0.85;
      const reverbDelay = ctx.createDelay(0.5);
      reverbDelay.delayTime.value = 0.18;
      const reverbFb = ctx.createGain();
      reverbFb.gain.value = 0.25;
      const reverbWet = ctx.createGain();
      reverbWet.gain.value = 0.35;
      birdBus.connect(reverbDelay);
      reverbDelay.connect(reverbFb).connect(reverbDelay);
      reverbDelay.connect(reverbWet).connect(master);
      birdBus.connect(master);

      const chirp = () => {
        if (!ctx) return;
        const t = ctx.currentTime;
        const pattern = Math.random();
        const baseFreq = 1400 + Math.random() * 2400;
        const notes = pattern < 0.3 ? 1 : pattern < 0.75 ? 2 + Math.floor(Math.random() * 3) : 5 + Math.floor(Math.random() * 3);
        const noteDur = 0.05 + Math.random() * 0.09;
        const gap = 0.02 + Math.random() * 0.05;
        const pan = (Math.random() - 0.5) * 1.4;
        const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        if (panner) { panner.pan.value = pan; panner.connect(birdBus); }
        for (let n = 0; n < notes; n++) {
          const startTime = t + n * (noteDur + gap);
          const osc = ctx.createOscillator();
          osc.type = Math.random() < 0.5 ? 'sine' : 'triangle';
          const noteShift = (Math.random() - 0.5) * 600;
          const f0 = baseFreq + noteShift;
          osc.frequency.setValueAtTime(f0, startTime);
          osc.frequency.exponentialRampToValueAtTime(f0 * (1 + (Math.random() - 0.3) * 0.4), startTime + noteDur);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, startTime);
          g.gain.exponentialRampToValueAtTime(0.22, startTime + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDur);
          osc.connect(g);
          g.connect(panner || birdBus);
          osc.start(startTime);
          osc.stop(startTime + noteDur + 0.02);
        }
        const nextGap = 350 + Math.random() * 2600;
        birdTimer = setTimeout(chirp, nextGap);
      };
      birdTimer = setTimeout(chirp, 400);

      nodes = { master, noise, lfo };

      const tick = () => {
        progress = (progress + 0.05) % 100;
        if (scrubFill) scrubFill.style.width = progress + '%';
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const toggle = () => {
      if (playing) {
        stop();
        playing = false;
        chip.classList.remove('is-playing');
        chip.setAttribute('aria-pressed', 'false');
        if (live) live.hidden = true;
        if (playBtn) playBtn.textContent = '▶';
        if (label) label.textContent = 'TOCÁ PARA OÍR';
      } else {
        start();
        playing = true;
        chip.classList.add('is-playing');
        chip.setAttribute('aria-pressed', 'true');
        if (live) live.hidden = false;
        if (playBtn) playBtn.textContent = '╵╵';
        if (label) label.textContent = 'AVES · SELVA';
      }
    };

    chip.addEventListener('click', toggle);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });

    window.addEventListener('beforeunload', stop);
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  ready(() => {
    initHeroVideo();
    initValueCards();
    initJungleChip();
  });
})();
