async function setRandomBackground() {
  try {
    const response = await fetch("/api/random-image");
    const data = await response.json();
    const imageUrl = data.imageUrl;

    // Preload the image
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      document.body.style.backgroundImage = `url(${imageUrl})`;
    };
  } catch (error) {
    console.error("Error fetching image:", error);
  }
}

// Call the function to set the background when the page loads
window.onload = setRandomBackground;

const bpmInput = document.getElementById("bpmInput");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

let intervalId;
let audioContext;
let tickCount = 0;

const playTickSound = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  const baseFrequency = 1000;
  const frequency = tickCount % 4 === 0 ? baseFrequency * 1.1 : baseFrequency;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.05);

  tickCount++;
};

const startMetronome = () => {
  const bpm = parseInt(bpmInput.value);

  if (isNaN(bpm) || bpm <= 0) {
    alert("Please enter a valid BPM value.");
    return;
  }

  const interval = 60000 / bpm;

  playTickSound(); // Play initial tick immediately
  intervalId = setInterval(playTickSound, interval);

  startButton.disabled = true;
  startButton.classList.add(
    "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)]",
    "cursor-not-allowed"
  );
};

const stopMetronome = () => {
  clearInterval(intervalId);
  startButton.disabled = false;
  startButton.classList.remove(
    "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.8)]",
    "cursor-not-allowed"
  );
  tickCount = 0;
};

startButton.addEventListener("click", startMetronome);
stopButton.addEventListener("click", stopMetronome);
