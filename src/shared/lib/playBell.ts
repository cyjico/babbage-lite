const BELL = new Audio("./bell.mp3");

export default function playBell() {
  BELL.currentTime = 0.15;
  BELL.play().catch((err) => console.error("Failed to play sound:", err));
}
