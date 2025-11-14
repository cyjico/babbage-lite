let AUDIO_CTX = new AudioContext();

const PARTIALS = [1, 1.24, 1.56, 1.9, 2.4, 3.2] as const;

export default function playBell(base = 500, volume = 0.8) {
  const now = AUDIO_CTX.currentTime;
  const master = AUDIO_CTX.createGain();
  master.gain.setValueAtTime(0.001, now);
  master.connect(AUDIO_CTX.destination);

  master.gain.linearRampToValueAtTime(volume, now + 0.005);
  master.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

  PARTIALS.forEach((r) => {
    const osc = AUDIO_CTX.createOscillator();
    const gain = AUDIO_CTX.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(base * r, now);

    gain.gain.setValueAtTime(0.5 / r, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.connect(gain);
    gain.connect(master);

    osc.start(now);
    osc.stop(now + 2.5);

    osc.onended = () => {
      gain.disconnect();
      osc.disconnect();
    };
  });
}
