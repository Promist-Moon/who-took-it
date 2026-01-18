// if familiar person detected, blare alarm
let alertLoopCount = 0;
let voiceLoopCount = 0;
let alertIsRunning = false;
let voiceIntervalId = null;

function triggerAlert() {
  const overlay = document.getElementById("alert-overlay");
  overlay?.classList.remove("hidden");

  const alertSound = document.getElementById("alert-sound");
  if (!alertSound) return;

  const voiceSound = document.getElementById("voice-sound");
  if (!voiceSound) return;

  // start sound only once
  if (alertIsRunning) return;
  alertIsRunning = true;

  // volume gradually increases
  alertLoopCount = 0;
  alertSound.volume = 0.2; // 0.0 to 1.0
  alertSound.currentTime = 0;

  voiceSound.volume = 0.7; // 0.0 to 1.0
  voiceSound.currentTime = 0;
  voiceSound.loop = false;
  voiceSound.onended = () => {
    voiceLoopCount += 1;
    voiceSound.volume = Math.min(1.0, 0.7 + voiceLoopCount * 0.15);
  };

  voiceSound.play().catch(() => {});

  voiceIntervalId = setInterval(() => {
    if (!voiceSound.paused) return;

    voiceSound.currentTime = 0;
    voiceSound.play().catch(() => {});
  }, 3000);

  alertSound.loop = false;
  // increase volume each loop (cap at 1.0)
  alertSound.onended = () => {
    alertLoopCount += 1;
    const nextVol = Math.min(1.0, 0.5 + alertLoopCount * 0.15);
    alertSound.volume = nextVol;

    alertSound.currentTime = 0;
    alertSound.play().catch(() => {});
  };

  alertSound.play().catch(() => {
      alertIsRunning = false;
      if (voiceIntervalId) clearInterval(voiceIntervalId);
  });
}

function showAlert() {
  document.getElementById("alert-overlay")?.classList.remove("hidden");
}

function stopAlert() {
  document.getElementById("alert-overlay")?.classList.add("hidden");

  const alertSound = document.getElementById("alert-sound");
  if (alertSound) {
    alertSound.onended = null;
    alertSound.pause();
    alertSound.currentTime = 0;
  }

  const voiceSound = document.getElementById("voice-sound");
  if (voiceSound) {
    voiceSound.pause();
    voiceSound.currentTime = 0;
  }

  if (voiceIntervalId) {
    clearInterval(voiceIntervalId);
    voiceIntervalId = null;
  }

  alertIsRunning = false;
  alertLoopCount = 0;
}