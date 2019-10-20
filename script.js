const defaultWorkTime = 25;
const defaultRestTime = 5;
const workRed = 31;
const workBlue = 101;
const workGreen = 117;
const restRed = 96;
const restBlue = 173;
const restGreen = 155;

const workRestDiffRed = Math.abs(workRed - restRed);
const workRestDiffBlue = Math.abs(workBlue - restBlue);
const workRestDiffGreen = Math.abs(workGreen - restGreen);

const timeToWorkAudio = new Audio('./assets/work-time.wav');
const timeToRestAudio = new Audio('./assets/rest-time.wav');
const click = new Audio('./assets/click.wav');

let isWorkTime = true;
let shouldPlayAudio = true;
let workTime = defaultWorkTime;
let restTime = defaultRestTime;

let interval;
let arrow;
let decimalPercentLeft;
let changeInRed;
let changeInBlue;
let changeInGreen;
let remainingTime;
setRemainingTime();

let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let soundButton = document.getElementById('sound');
let workLength = document.getElementById('work');
let restLength = document.getElementById('rest');
let resetButton = document.getElementById('reset');

let workArrowUp = document.getElementById('work-arrow-up');
let workArrowDown = document.getElementById('work-arrow-down');
let restArrowUp = document.getElementById('rest-arrow-up');
let restArrowDown = document.getElementById('rest-arrow-down');

let buttons = document.getElementsByClassName('with-sound');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    playAudio(click);
  });
}

let mainDisplay = document.getElementById('main-display');
let progressBar = document.getElementById('time-left');
let title = document.querySelector('title');
let arrows = document.getElementsByClassName('arrow');
let body = document.querySelector('body');
let message = document.querySelector('h1');

startButton.addEventListener('click', () => {
  (document.querySelector('.fa-pause') !== null) ? stopClock() : startClock();
  workLength.disabled = true;
  restLength.disabled = true;
  disableOrEnableArrows('disable');
  toggleStartPause();
});

stopButton.addEventListener('click', () => {
  stopClock();
  isWorkTime = true;
  showPlay();
  setRemainingTime();
  updateDisplayTime();
  workLength.disabled = false;
  restLength.disabled = false;
  disableOrEnableArrows('enable');
  updateMessage('POMODORO');
  resetColor();
});

soundButton.addEventListener('click', () => {
  shouldPlayAudio = shouldPlayAudio ? false : true;
  toggleSoundMute();
});

workLength.addEventListener('input', (e) => {
  workTime = Math.floor(Math.abs(e.target.value));
  if (workTime === 0) {
    workTime = 1;
  }

  workLength.value = workTime;
  setRemainingTime();
  updateDisplayTime();
});

restLength.addEventListener('input', e => {
  restTime = Math.floor(Math.abs(e.target.value));
  if (restTime === 0) {
    restTime = 1;
  }

  restLength.value = restTime;
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
  workLength.disabled = false;
  restLength.disabled = false;
  disableOrEnableArrows('enable');
  updateMessage('POMODORO');
  resetColor();
});

workArrowUp.addEventListener('click', () => {
  workLength.stepUp();
  workLength.dispatchEvent(new Event('input'));
});

workArrowDown.addEventListener('click', () => {
  workLength.stepDown();
  workLength.dispatchEvent(new Event('input'));
});

restArrowUp.addEventListener('click', () => {
  restLength.stepUp();
  restLength.dispatchEvent(new Event('input'));
});

restArrowDown.addEventListener('click', () => {
  restLength.stepDown();
  restLength.dispatchEvent(new Event('input'));
});

function setRemainingTime() {
  remainingTime = maxTime();
}

function maxTime() {
  return (isWorkTime) ? workTime * 60 : restTime * 60;
}

function startClock() {
  interval = setInterval(() => {
    remainingTime -= 1;
    updateDisplayTime();
    switchWorkRest();
    changeBackground();
  }, 1000);
}

function stopClock() {
  clearInterval(interval);
}

function updateDisplayTime() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  let time = minutes + ':' + seconds;
  mainDisplay.textContent = time;
  title.textContent = isWorkTime ? time + ' of work left' : time + ' of rest left';
  updateProgressBar();
}

function updateProgressBar() {
  progressBar.style.width = (remainingTime * 100) / maxTime() + '%';
}

function switchWorkRest() {
  if (remainingTime <= 0) {
    isWorkTime = isWorkTime ? false : true;
    let audio = isWorkTime ? timeToRestAudio : timeToWorkAudio;
    playAudio(audio);
    setRemainingTime();
    isWorkTime ? updateMessage('TIME TO WORK') : updateMessage('REST A LITTLE');
  }
}

function playAudio(audio) {
  if (shouldPlayAudio) {
    audio.play();
  }
}

function updateMessage(newMessage) {
  message.textContent = newMessage;
}

function changeBackground() {
  decimalPercentLeft = remainingTime / maxTime();

  changeInRed = Math.floor(decimalPercentLeft * workRestDiffRed);
  changeInGreen = Math.floor(decimalPercentLeft * workRestDiffGreen);
  changeInBlue = Math.floor(decimalPercentLeft * workRestDiffBlue);

  isWorkTime ? transitionColors(restRed, restGreen, restBlue) : transitionColors(workRed, workGreen, workBlue);
}

function transitionColors(finishRed, finishGreen, finishBlue) {
  startRed = (finishRed === restRed) ? workRed : restRed;
  startGreen = (finishGreen === restGreen) ? workGreen : restGreen;
  startBlue = (finishBlue === restBlue) ? workBlue : restBlue;

  let redInTransition = (finishRed < startRed) ? finishRed + changeInRed : finishRed - changeInRed;
  let greenInTransition = (finishGreen < startGreen) ? finishGreen + changeInGreen : finishGreen - changeInGreen;
  let blueInTransition = (finishBlue < startBlue) ? finishBlue + changeInBlue : finishBlue - changeInBlue;

  body.style.backgroundColor = `rgb(${redInTransition}, ${greenInTransition}, ${blueInTransition}`;
}

function disableOrEnableArrows(able) {
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].disabled = (able === 'disable') ? true : false;
  }
}

function toggleStartPause() {
  (document.querySelector('.fa-play') !== null) ? showPause() : showPlay();
}

function showPause() {
  startButton.classList.add('fa-pause');
  startButton.classList.remove('fa-play');
  updateMessage('TIME TO WORK');
}

function showPlay() {
  startButton.classList.remove('fa-pause');
  startButton.classList.add('fa-play');
  updateMessage('PAUSED POMODORO');
}

function resetColor() {
  body.style.backgroundColor = `rgb(${workRed}, ${workGreen}, ${workBlue})`;
}

function toggleSoundMute() {
  (document.querySelector('.fa-volume-up') !== null) ? showMute() : showSound();
}

function showMute() {
  soundButton.classList.add('fa-volume-mute');
  soundButton.classList.remove('fa-volume-up');
}

function showSound() {
  soundButton.classList.add('fa-volume-up');
  soundButton.classList.remove('fa-volume-mute');
}

function updateWorkTimeInput() {
  workLength.value = workTime;
}

function updateRestTimeInput() {
  restLength.value = restTime;
}
