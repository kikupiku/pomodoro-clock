const defaultWorkTime = 25;
const defaultRestTime = 5;

let isWorkTime = true;
let workTime = defaultWorkTime;
let restTime = defaultRestTime;
let remainingTime;

let workLength = document.getElementById('work');
let restLength = document.getElementById('rest');
let mainDisplay = document.getElementById('main-display');
let resetButtoon = document.getElementById('reset');

workLength.addEventListener('input', (e) => {
  workTime = e.target.value;
  setRemainingTime();
  updateDisplayTime();
});

restLength.addEventListener('input', e => {
  restTime = e.target.value;
  setRemainingTime();
});

resetButtoon.addEventListener('click', () => {
  workTime = defaultWorkTime;
  restTime = defaultRestTime;
  isWorkTime = true;
  updateWorkTimeInput();
  updateRestTimeInput();
  setRemainingTime();
  updateDisplayTime();
});

function setRemainingTime() {
  remainingTime = (isWorkTime) ? workTime * 60 : restTime * 60;
}

function updateDisplayTime() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  mainDisplay.textContent = minutes + ':' + seconds;
}

function updateWorkTimeInput() {
  workLength.value = workTime;
}

function updateRestTimeInput() {
  restLength.value = restTime;
}
