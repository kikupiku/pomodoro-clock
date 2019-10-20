const defaultWorkTime = 25;
const defaultRestTime = 5;

const workRed = 31;
const workBlue = 117;
const workGreen = 101;

const restRed = 96;
const restBlue = 155;
const restGreen = 173;

let decimalPercentLeft;
let changeInRed;
let changeInBlue;
let changeInGreen;

let workRestDiffRed = Math.abs(workRed - restRed);
let workRestDiffBlue = Math.abs(workBlue - restBlue);
let workRestDiffGreen = Math.abs(workGreen - restGreen);

let isWorkTime = true;
let shouldPlayAudio = true;
let workTime = defaultWorkTime;
let restTime = defaultRestTime;
let timeToWorkAudio = new Audio('./assets/work-time.wav');
let timeToRestAudio = new Audio('./assets/rest-time.wav');
let click = new Audio('./assets/click.wav');
let remainingTime;
setRemainingTime();

let interval;
let arrow;

let workLength = document.getElementById('work');
let restLength = document.getElementById('rest');
let mainDisplay = document.getElementById('main-display');
let resetButton = document.getElementById('reset');
let startButton = document.getElementById('start');
let stopButton = document.getElementById('stop');
let progressBar = document.getElementById('time-left');
let buttons = document.getElementsByClassName('with-sound');
let soundButton = document.getElementById('sound');
let title = document.querySelector('title');
let arrows = document.getElementsByClassName('arrow');
let body = document.querySelector('body');
let workArrowUp = document.getElementById('work-arrow-up');
let workArrowDown = document.getElementById('work-arrow-down');
let restArrowUp = document.getElementById('rest-arrow-up');
let restArrowDown = document.getElementById('rest-arrow-down');
let message = document.querySelector('h1');

function disableOrEnableArrows(able) {
  for (let i = 0; i < arrows.length; i++) {
    arrows[i].disabled = (able === 'disable') ? true : false;
  }
}

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    playAudio(click);
  });
}

function playAudio(audio) {
  if (shouldPlayAudio) {
    audio.play();
  }
}

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

function updateMessage(newMessage) {
  message.textContent = newMessage;
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

function startClock() {
  interval = setInterval(() => {
    remainingTime -= 1;
    updateDisplayTime();
    switchWorkRest();
    changeBackground();
  }, 1000);
}

function changeBackground() {
  decimalPercentLeft = remainingTime / maxTime();

  changeInRed = Math.floor(decimalPercentLeft * workRestDiffRed);
  changeInBlue = Math.floor(decimalPercentLeft * workRestDiffBlue);
  changeInGreen = Math.floor(decimalPercentLeft * workRestDiffGreen);

  isWorkTime ? transitionColors(restRed, restBlue, restGreen) : transitionColors(workRed, workBlue, workGreen);
}

function transitionColors(finishRed, finishBlue, finishGreen) {
  startRed = (finishRed === restRed) ? workRed : restRed;
  startBlue = (finishBlue === restBlue) ? workBlue : restBlue;
  startGreen = (finishGreen === restGreen) ? workGreen : restGreen;

  let redInTransition = (finishRed < startRed) ? finishRed + changeInRed : finishRed - changeInRed;
  let blueInTransition = (finishBlue < startBlue) ? finishBlue + changeInBlue : finishBlue - changeInBlue;
  let greenInTransition = (finishGreen < startGreen) ? finishGreen + changeInGreen : finishGreen - changeInGreen;

  body.style.backgroundColor = `rgb(${redInTransition}, ${blueInTransition}, ${greenInTransition}`;
}

function resetColor() {
  body.style.backgroundColor = 'rgb(31, 117, 101)';
}

function stopClock() {
  clearInterval(interval);
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

  let time = minutes + ':' + seconds;
  mainDisplay.textContent = time;
  title.textContent = isWorkTime ? time + ' of work left' : time + ' of rest left';
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
// TODO:
// prevent putting in negative numbers to input
