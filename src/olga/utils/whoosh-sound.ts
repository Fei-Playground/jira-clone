/**
 * Plays a brief synthetic whoosh sound via the Web Audio API.
 *
 * The sound is a band-pass-filtered white-noise burst that decays
 * in ~150ms — like a card being swiped off a surface.
 *
 * Silenced automatically when prefers-reduced-motion: reduce is set,
 * because that media query is used as a proxy for "no audio feedback"
 * in the OLGA design system.
 *
 * Safe to call in any environment (SSR, tests, browsers without Web Audio).
 */
export const playWhoosh = (direction: "left" | "right" = "right"): void => {
  // Guard: skip if user prefers reduced motion
  if (
    typeof window === "undefined" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  try {
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    // ── White noise source ──────────────────────────────────────
    const bufferSize = ctx.sampleRate * 0.15; // 150ms of samples
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // ── Band-pass filter (centred ~800 Hz) ─────────────────────
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 0.8;

    // ── Gain envelope: fast attack, 150ms exponential decay ────
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    // ── Stereo panning: right card → slight right pan, left → left ──
    const panner = ctx.createStereoPanner();
    panner.pan.value = direction === "right" ? 0.3 : -0.3;

    // Connect: noise → filter → gain → panner → output
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);

    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + 0.15);

    // Clean up after the sound finishes
    noiseSource.onended = () => ctx.close();
  } catch {
    // Silently fail — audio is non-essential
  }
};
