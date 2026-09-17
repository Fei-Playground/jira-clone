import { useCallback, useEffect, useRef, useState } from "react";
import { MOOD_SYNTH_PARAMS, MusicMood } from "@domain/music";

// A real, generated ambient soundtrack — two detuned oscillators (a base
// tone + a harmonic) run through a slow LFO-modulated gain, synthesized
// live with the Web Audio API. This is genuine audio synthesis, not a
// licensed music track (the sandbox has no network access to fetch one):
// every parameter comes from MOOD_SYNTH_PARAMS, so changing the mood really
// changes the pitch/timbre/movement of what's playing, in real time.
//
// Autoplay policies require a user gesture before any AudioContext can
// produce sound, so the context is only created lazily inside `toggle()`
// (a user click), never on mount.
export interface AmbientSoundtrackControls {
  isPlaying: boolean;
  isSupported: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  toggle: () => void;
}

interface AudioGraph {
  context: AudioContext;
  baseOscillator: OscillatorNode;
  harmonicOscillator: OscillatorNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
  masterGain: GainNode;
}

export const useAmbientSoundtrack = (mood: MusicMood): AmbientSoundtrackControls => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const graphRef = useRef<AudioGraph | null>(null);
  const isSupported =
    typeof window !== "undefined" &&
    (typeof window.AudioContext !== "undefined" ||
      // Older Safari
      typeof (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext !==
        "undefined");

  const teardownGraph = useCallback(() => {
    const graph = graphRef.current;
    if (!graph) return;
    graph.baseOscillator.stop();
    graph.harmonicOscillator.stop();
    graph.lfo.stop();
    graph.context.close();
    graphRef.current = null;
  }, []);

  const buildGraph = useCallback((currentMood: MusicMood, currentVolume: number): AudioGraph => {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const context = new AudioContextCtor();
    const params = MOOD_SYNTH_PARAMS[currentMood];

    const masterGain = context.createGain();
    masterGain.gain.value = currentVolume;
    masterGain.connect(context.destination);

    const baseOscillator = context.createOscillator();
    baseOscillator.type = params.waveform;
    baseOscillator.frequency.value = params.baseFrequency;
    const baseGain = context.createGain();
    baseGain.gain.value = 0.6;
    baseOscillator.connect(baseGain);
    baseGain.connect(masterGain);

    const harmonicOscillator = context.createOscillator();
    harmonicOscillator.type = params.harmonicWaveform;
    harmonicOscillator.frequency.value = params.baseFrequency * params.harmonicRatio;
    const harmonicGain = context.createGain();
    harmonicGain.gain.value = 0.35;
    harmonicOscillator.connect(harmonicGain);
    harmonicGain.connect(masterGain);

    // A slow LFO modulates the master gain so the pad "breathes" rather
    // than droning at a flat volume — the tell that this is a live,
    // generated sound rather than a static tone.
    const lfo = context.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = params.lfoRate;
    const lfoGain = context.createGain();
    lfoGain.gain.value = params.lfoDepth / 100;
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);

    baseOscillator.start();
    harmonicOscillator.start();
    lfo.start();

    return {
      context,
      baseOscillator,
      harmonicOscillator,
      lfo,
      lfoGain,
      masterGain,
    };
  }, []);

  const toggle = useCallback(() => {
    if (!isSupported) return;
    if (graphRef.current) {
      teardownGraph();
      setIsPlaying(false);
      return;
    }
    graphRef.current = buildGraph(mood, volume);
    setIsPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buildGraph, teardownGraph, isSupported]);

  // Mood changes while playing: re-target the existing oscillators to the
  // new mood's frequencies/waveforms instead of restarting, so the shift is
  // audible as a real transition rather than a jarring cut.
  useEffect(() => {
    const graph = graphRef.current;
    if (!graph) return;
    const params = MOOD_SYNTH_PARAMS[mood];
    const now = graph.context.currentTime;
    graph.baseOscillator.type = params.waveform;
    graph.baseOscillator.frequency.linearRampToValueAtTime(params.baseFrequency, now + 1.5);
    graph.harmonicOscillator.type = params.harmonicWaveform;
    graph.harmonicOscillator.frequency.linearRampToValueAtTime(
      params.baseFrequency * params.harmonicRatio,
      now + 1.5
    );
    graph.lfo.frequency.linearRampToValueAtTime(params.lfoRate, now + 1.5);
    graph.lfoGain.gain.linearRampToValueAtTime(params.lfoDepth / 100, now + 1.5);
  }, [mood]);

  const setVolume = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(1, next));
    setVolumeState(clamped);
    const graph = graphRef.current;
    if (graph) {
      graph.masterGain.gain.linearRampToValueAtTime(clamped, graph.context.currentTime + 0.2);
    }
  }, []);

  // Stop and release the audio graph on unmount (leaving a scene, or the
  // component tearing down) — never leak a running AudioContext.
  useEffect(() => {
    return () => teardownGraph();
  }, [teardownGraph]);

  return { isPlaying, isSupported, volume, setVolume, toggle };
};
