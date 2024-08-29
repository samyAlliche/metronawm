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

// INCREASE AND DECREASE BPM

let increaseInterval, decreaseInterval;
let increaseSpeed = 500; // Start interval at 500ms
let decreaseSpeed = 500;
let minInterval = 50; // The minimum interval time

document
  .getElementById("increaseBpm")
  .addEventListener("mousedown", function () {
    increaseBpm();
    increaseInterval = setInterval(function () {
      increaseBpm();
      if (increaseSpeed > minInterval) {
        increaseSpeed -= 50;
        clearInterval(increaseInterval);
        increaseInterval = setInterval(arguments.callee, increaseSpeed);
      }
    }, increaseSpeed);
  });

document.getElementById("increaseBpm").addEventListener("mouseup", function () {
  clearInterval(increaseInterval);
  increaseSpeed = 500;
});

document
  .getElementById("decreaseBpm")
  .addEventListener("mousedown", function () {
    decreaseBpm();
    decreaseInterval = setInterval(function () {
      decreaseBpm();
      if (decreaseSpeed > minInterval) {
        decreaseSpeed -= 50; // Accelerate by reducing the interval
        clearInterval(decreaseInterval);
        decreaseInterval = setInterval(arguments.callee, decreaseSpeed);
      }
    }, decreaseSpeed);
  });

document.getElementById("decreaseBpm").addEventListener("mouseup", function () {
  clearInterval(decreaseInterval);
  decreaseSpeed = 500; // Reset speed
});

const increaseBpm = () => {
  let input = document.getElementById("bpmInput");
  if (parseInt(input.value) < parseInt(input.max)) {
    input.value = parseInt(input.value) + 1;
  }
};

const decreaseBpm = () => {
  let input = document.getElementById("bpmInput");
  if (parseInt(input.value) > parseInt(input.min)) {
    input.value = parseInt(input.value) - 1;
  }
};

//START & STOP METRONOME

startButton.addEventListener("click", startMetronome);
stopButton.addEventListener("click", stopMetronome);
