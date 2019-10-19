const defaultWorkTime = 25;
const defaultRestTime = 5;

let isWorkTime = true;
let workTime = defaultWorkTime;
let restTime = defaultRestTime;
let remainingTime;
setRemainingTime();

let interval;

let workLength = document.getElementById('work');
let restLength = document.getElementById('rest');
let mainDisplay = document.getElementById('main-display');
let resetButton = document.getElementById('reset');
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let progressBar = document.getElementById('time-left');

workLength.addEventListener('input', (e) => {
  workTime = e.target.value;
  setRemainingTime();
  updateDisplayTime();
});

restLength.addEventListener('input', e => {
  restTime = e.target.value;
  setRemainingTime();
});

resetButton.addEventListener('click', () => {
  workTime = defaultWorkTime;
  restTime = defaultRestTime;
  isWorkTime = true;
  updateWorkTimeInput();
  updateRestTimeInput();
  setRemainingTime();
  updateDisplayTime();
  stopClock();
  showPlay();
});

startButton.addEventListener('click', () => {
  (document.querySelector('.fa-pause') !== null) ? stopClock() : startClock();

  toggleStartPause();
});

stopButton.addEventListener('click', () => {
  stopClock();
  isWorkTime = true;
  showPlay();
  setRemainingTime();
  updateDisplayTime();
});

function toggleStartPause() {
  (document.querySelector('.fa-play') !== null) ? showPause() : showPlay();
}

function showPause() {
  startButton.classList.remove('fa-play');
  startButton.classList.add('fa-pause');
}

function showPlay() {
  startButton.classList.remove('fa-pause');
  startButton.classList.add('fa-play');
}

function startClock() {
  interval = setInterval(() => {
    console.log(remainingTime);
    console.log(isWorkTime);
    remainingTime -= 1;
    updateDisplayTime();
    switchWorkRest();
  }, 1000);

}

function stopClock() {
  clearInterval(interval);
}

function switchWorkRest() {
  if (remainingTime <= 0) {
    console.log('switching now');
    isWorkTime = isWorkTime ? false : true;
    setRemainingTime();
  }
}

function setRemainingTime() {
  remainingTime = maxTime();
}

function maxTime() {
  return (isWorkTime) ? workTime * 60 : restTime * 60;
}

function updateDisplayTime() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  mainDisplay.textContent = minutes + ':' + seconds;
  updateProgressBar();
}

function updateWorkTimeInput() {
  workLength.value = workTime;
}

function updateRestTimeInput() {
  restLength.value = restTime;
}

function updateProgressBar() {
  progressBar.style.width = (remainingTime * 100) / maxTime() + '%';
}
