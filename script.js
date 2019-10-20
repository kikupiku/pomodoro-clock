const defaultWorkTime = 25;
const defaultRestTime = 5;
const workRed = 31;
const workGreen = 117;
const workBlue = 101;
const restRed = 96;
const restGreen = 155;
const restBlue = 173;

const timeToWorkAudio = new Audio('./assets/work-time.wav');
const timeToRestAudio = new Audio('./assets/rest-time.wav');
const click = new Audio('./assets/click.wav');

let isWorkTime = true;
let shouldPlayAudio = true;
let workTime = defaultWorkTime;
let restTime = defaultRestTime;

let interval;
let arrow;
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
let arrows = [workArrowUp, workArrowDown, restArrowUp, restArrowDown];

let buttons = document.getElementsByClassName('with-sound');
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', () => {
    playAudio(click);
  });
}

let mainDisplay = document.getElementById('main-display');
let progressBar = document.getElementById('time-left');
let title = document.querySelector('title');
let body = document.querySelector('body');
let message = document.querySelector('h1');

startButton.addEventListener('click', () => {
  (document.querySelector('.fa-pause') !== null) ? stopClock() : startClock();
  disableInputs();
  toggleStartPause();
});

stopButton.addEventListener('click', () => {
  stopClock();
  isWorkTime = true;
  showPlay();
  setRemainingTime();
  updateDisplayTime();
  enableInputs();
  updateMessage('POMODORO');
  resetColor();
});

soundButton.addEventListener('click', () => {
  shouldPlayAudio = shouldPlayAudio ? false : true;
  toggleSoundMute();
});

workLength.addEventListener('input', (e) => {
  workTime = cleanInput(e.target.value);
  updateWorkTimeInput();
  setRemainingTime();
  updateDisplayTime();
});

restLength.addEventListener('input', e => {
  restTime = cleanInput(e.target.value);
  updateRestTimeInput();
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
  enableInputs();
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
  let time = formatRemainingTime();

  updateCountdown(time);
  updateTitle(time);
  updateProgressBar();
}

function formatRemainingTime() {
  let minutes = Math.floor(remainingTime / 60);
  let seconds = remainingTime % 60;
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return minutes + ':' + seconds;
}

function updateCountdown(time) {
  mainDisplay.textContent = time;
}

function updateTitle(time) {
  title.textContent = isWorkTime ? time + ' of work left' : time + ' of rest left';
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
  isWorkTime ? transitionToRestColors() : transitionToWorkColors();
}

function transitionToRestColors() {
  transitionToColors(restRed, restGreen, restBlue);
}

function transitionToWorkColors() {
  transitionToColors(workRed, workGreen, workBlue);
}

function transitionToColors(finishRed, finishGreen, finishBlue) {
  let startRed = getStartingColor(finishRed, restRed, workRed);
  let startGreen = getStartingColor(finishGreen, restGreen, workGreen);
  let startBlue = getStartingColor(finishBlue, restBlue, workBlue);

  let changeInRed = getChangeInColor(workRed, restRed);
  let changeInGreen = getChangeInColor(workGreen, restGreen);
  let changeInBlue = getChangeInColor(workBlue, restBlue);

  let redInTransition = calculateChange(startRed, changeInRed, finishRed);
  let greenInTransition = calculateChange(startGreen, changeInGreen, finishGreen);
  let blueInTransition = calculateChange(startBlue, changeInBlue, finishBlue);

  body.style.backgroundColor = `rgb(${redInTransition}, ${greenInTransition}, ${blueInTransition}`;
}

function getStartingColor(finishColor, restColor, workColor) {
  return (finishColor === restColor) ? workColor : restColor;
}

function getChangeInColor(workColor, restColor) {
  let decimalPercentLeft = remainingTime / maxTime();
  let workRestDiff = Math.abs(workColor - restColor);
  return Math.floor(decimalPercentLeft * workRestDiff);
}

function calculateChange(startColor, changeInColor, finishColor) {
  return (finishColor < startColor) ? finishColor + changeInColor : finishColor - changeInColor;
}

function enableInputs() {
  setInputsDisabled(false);
}

function disableInputs() {
  setInputsDisabled(true);
}

function setInputsDisabled(trueOrFalse) {
  workLength.disabled = trueOrFalse;
  restLength.disabled = trueOrFalse;
  arrows.forEach(arrow => arrow.disabled = trueOrFalse);
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
  startButton.classList.add('fa-play');
  startButton.classList.remove('fa-pause');
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

function cleanInput(inputNumber) {
  newInput = Math.floor(Math.abs(inputNumber));
  if (newInput === 0) {
    newInput = 1;
  }

  return newInput;
}

function updateWorkTimeInput() {
  workLength.value = workTime;
}

function updateRestTimeInput() {
  restLength.value = restTime;
}
