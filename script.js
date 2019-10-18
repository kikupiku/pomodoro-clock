let isWorkTime = true;
let workTime = 25;
let restTime = 5;
let remainingTime;

let workLength = document.getElementById('work');
let restLength = document.getElementById('rest');
let mainDisplay = document.getElementById('main-display');

workLength.addEventListener('input', (e) => {
  workTime = e.target.value;
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
