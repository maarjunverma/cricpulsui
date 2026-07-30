// Web Audio API Sound Synthesis Service for CricPuls
// Creates real-time audio effects for a fully immersive cricket simulation

let audioCtx = null;
let isMuted = true; // start muted by default to respect browser policies

// Initialize AudioContext on user gesture
export function initAudio() {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  // Resume context if suspended (common in browser environments)
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function setMute(mute) {
  isMuted = mute;
  if (!mute) {
    initAudio();
  }
}

export function getMuteState() {
  return isMuted;
}

// Generate a simple click/wood strike sound for bat hitting ball
function playBatHit(intensity = 0.5) {
  if (!audioCtx || isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  // Combine triangle wave with quick frequency slide for wooden bat "tock"
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(550, now);
  osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

  gain.gain.setValueAtTime(intensity * 0.4, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

// Synthesize crowd noise using bandpass-filtered white noise
function playCrowdCheer(runs) {
  if (!audioCtx || isMuted) return;
  
  const now = audioCtx.currentTime;
  const duration = runs === 6 ? 3.5 : 2.0;
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  
  // Fill buffer with random noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = buffer;

  // Bandpass filter to sculpt white noise into crowd frequencies
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1000, now);
  // Animate the frequency to match cheering excitement curve
  filter.frequency.exponentialRampToValueAtTime(runs === 6 ? 1800 : 1500, now + 0.5);
  filter.Q.setValueAtTime(2.0, now);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  // swell up
  gain.gain.linearRampToValueAtTime(runs === 6 ? 0.3 : 0.15, now + 0.3);
  // fade down
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration - 0.1);

  noiseNode.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noiseNode.start(now);
  noiseNode.stop(now + duration);
}

// Sound of stumps rattling + crowd sigh/gasp
function playWicket() {
  if (!audioCtx || isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;

  // 1. Thud / ball hitting stump
  const thudOsc = audioCtx.createOscillator();
  const thudGain = audioCtx.createGain();
  thudOsc.type = 'sawtooth';
  thudOsc.frequency.setValueAtTime(110, now);
  thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.12);
  thudGain.gain.setValueAtTime(0.35, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  thudOsc.connect(thudGain);
  thudGain.connect(audioCtx.destination);
  thudOsc.start(now);
  thudOsc.stop(now + 0.16);

  // 2. Wood splintering / bails falling (multiple high frequency pops)
  for (let i = 0; i < 4; i++) {
    const startOffset = i * 0.035;
    const bailOsc = audioCtx.createOscillator();
    const bailGain = audioCtx.createGain();
    
    bailOsc.type = 'triangle';
    bailOsc.frequency.setValueAtTime(800 - (i * 120), now + startOffset);
    bailGain.gain.setValueAtTime(0.12, now + startOffset);
    bailGain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + 0.06);
    
    bailOsc.connect(bailGain);
    bailGain.connect(audioCtx.destination);
    
    bailOsc.start(now + startOffset);
    bailOsc.stop(now + startOffset + 0.07);
  }

  // 3. Crowd gasp (filtered noise moving down in pitch)
  const gaspDuration = 1.8;
  const bufferSize = audioCtx.sampleRate * gaspDuration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  const gaspNode = audioCtx.createBufferSource();
  gaspNode.buffer = buffer;
  
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(320, now + 0.6);
  filter.Q.setValueAtTime(2.5, now);

  const gaspGain = audioCtx.createGain();
  gaspGain.gain.setValueAtTime(0.001, now);
  gaspGain.gain.linearRampToValueAtTime(0.18, now + 0.15);
  gaspGain.gain.exponentialRampToValueAtTime(0.001, now + gaspDuration - 0.1);

  gaspNode.connect(filter);
  filter.connect(gaspGain);
  gaspGain.connect(audioCtx.destination);

  gaspNode.start(now);
  gaspNode.stop(now + gaspDuration);
}

// Umpire whistle signal for wide/no-ball (sharp double-beep)
function playWhistle() {
  if (!audioCtx || isMuted) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const now = audioCtx.currentTime;
  
  // Double beep whistle
  [0, 0.15].forEach((startOffset) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2200, now + startOffset);
    // Add frequency modulation for a whistle trill
    osc.frequency.linearRampToValueAtTime(2350, now + startOffset + 0.05);
    
    gain.gain.setValueAtTime(0.08, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + 0.08);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now + startOffset);
    osc.stop(now + startOffset + 0.1);
  });
}

// Public API to trigger sounds based on simulation events
export function playBallEvent(event) {
  if (isMuted) return;
  
  if (event === '0') {
    // Soft block
    playBatHit(0.25);
  } else if (event === '1' || event === '2' || event === '3') {
    // Normal scoring shots
    playBatHit(0.5);
    // Subtle crowd murmur
    setTimeout(() => playCrowdCheer(1), 100);
  } else if (event === '4') {
    // Boundary 4
    playBatHit(0.8);
    setTimeout(() => playCrowdCheer(4), 100);
  } else if (event === '6') {
    // Boundary 6
    playBatHit(1.0);
    setTimeout(() => playCrowdCheer(6), 100);
  } else if (event === 'W') {
    // Out!
    playWicket();
  } else if (event === 'Wd' || event === 'Nb') {
    // Wide / no-ball
    playWhistle();
  }
}
