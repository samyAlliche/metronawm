const setRandomBackground = async () => {
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
    document.body.style.backgroundColor = "#3a170d";
  }
};

const bpmInput = document.getElementById("bpmInput");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const changeSoundButton = document.getElementById("changeSound");
const changeSoundInput = document.getElementById("tickSound");

let intervalId;
let audioContext;
let tickCount = 0;
let tickSoundId = 1;

const playTickSound = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const baseFrequency = 1000;
  const frequency = tickCount % 4 === 0 ? baseFrequency * 1.1 : baseFrequency;

  if (tickSoundId === 2) {
    const audio = new Audio("./sounds/hat.wav");
    audio.play();
  } else if (tickSoundId === 3) {
    const audio = new Audio("./sounds/rim.wav");
    audio.play();
  } else {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  }

  tickCount++;
};

let activeDot = 0; // Track the active dot

const updateDots = () => {
  // Remove 'glow' class from all dots
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`dot${i}`).classList.remove("glow");
    document.getElementById(`dot${i}`).classList.remove("bg-red-700");
  }
  // Add 'glow' class to the current dot
  document
    .getElementById(`dot${activeDot + 1}`)
    .classList.add("glow", "bg-red-700");
  // Update the active dot index
  activeDot = (activeDot + 1) % 4;
};

const startMetronome = () => {
  const bpm = parseInt(bpmInput.value);

  if (isNaN(bpm) || bpm <= 0) {
    alert("Please enter a valid BPM value.");
    return;
  }

  const interval = 60000 / bpm;

  // Play initial tick and update dots immediately
  playTickSound();
  updateDots(); // Ensure dots update on start

  intervalId = setInterval(() => {
    playTickSound();
    updateDots();
  }, interval);

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
  // Reset all dots to non-glowing state
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`dot${i}`).classList.remove("glow");
  }
  activeDot = 0;
};

const changeSound = () => {
  if (tickSoundId >= 3) tickSoundId = 1;
  else tickSoundId++;

  changeSoundInput.value = tickSoundId;
  saveSettings();
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
  stopMetronome();
  let input = document.getElementById("bpmInput");
  if (parseInt(input.value) < parseInt(input.max)) {
    input.value = parseInt(input.value) + 1;
    saveSettings();
  }
};

const decreaseBpm = () => {
  stopMetronome();
  let input = document.getElementById("bpmInput");
  if (parseInt(input.value) > parseInt(input.min)) {
    input.value = parseInt(input.value) - 1;
    saveSettings();
  }
};

// LocalStorage
const saveSettings = () => {
  const bpm = bpmInput.value;
  const soundId = tickSoundId;
  localStorage.setItem("bpm", bpm);
  localStorage.setItem("tickSoundId", soundId);
};

// Call saveSettings whenever BPM or sound changes
bpmInput.addEventListener("change", saveSettings);
document.getElementById("changeSound").addEventListener("click", saveSettings);

const loadSettings = () => {
  const savedBpm = localStorage.getItem("bpm");
  const savedSoundId = localStorage.getItem("tickSoundId");

  if (savedBpm) {
    bpmInput.value = savedBpm;
  }
  if (savedSoundId) {
    tickSoundId = parseInt(savedSoundId, 10);
    document.getElementById("tickSound").value = tickSoundId;
  }
};

// Load settings when the page loads
window.addEventListener("load", () => {
  setRandomBackground(); // Ensure this is called before loading settings
  loadSettings();
});

//START & STOP METRONOME

startButton.addEventListener("click", startMetronome);
stopButton.addEventListener("click", stopMetronome);
changeSoundButton.addEventListener("click", changeSound);
