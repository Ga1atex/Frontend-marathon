const startBtn = document.querySelector('#start');
const screens = document.querySelectorAll('.screen');
const timeList = document.querySelector('#time-list');
const timeEl = document.querySelector('#time');
const board = document.querySelector('#board');
const scoreEl = document.querySelector('#score');

let time = 0;
let score = 0;
let timer;
const colors = ['radial-gradient(at top, #FEFFFF, #A7CECC)', 'radial-gradient(40% 50%, #FAECD5, #CAE4D8)', 'linear-gradient(to top left, powderblue, pink)', 'linear-gradient(to top, #E4AF9D 20%, #E4E4D8 50%, #A19887 80%)', 'radial-gradient(white, #FFA9A1)', 'radial-gradient(circle at 65% 15%, aqua, darkblue)'];

startBtn.addEventListener('click', (event) => {
  event.preventDefault();
  screens[0].classList.add('up');
});

timeList.addEventListener('click', event => {
  if (event.target.classList.contains('time-btn')) {
    time = parseInt(event.target.dataset.time);     //можно + вместо parseInt
    screens[1].classList.add('up');
    startGame();
  }
});

board.addEventListener('click', boardHandler);


function boardHandler(event) {
  if (event.target.classList.contains('circle')) {
    scoreEl.innerHTML = ++score;
    // event.target.remove();
  }
  createRandomCircle();
}

function startGame() {
  timer = setInterval(decreaseTime, 1000);
  setTime(time);
  createRandomCircle();
}

function decreaseTime() {
  if (time === 0) {
    finishGame();
  } else {
    setTime(--time);
    if (!document.querySelector('.circle')) {
      createRandomCircle();
    }
  }
}

function setTime(value) {
  let minutes = Math.floor(value / 60);
  let seconds = value % 60;

  timeEl.innerHTML = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

function finishGame() {
  timeEl.parentElement.classList.add('hide');
  scoreEl.parentElement.classList.add('hide');
  board.innerHTML = `<h1>Счет: <span class="primary">${score}</span></h1><a class="time-btn start" id="startAgain">Снова</a>`;
  board.removeEventListener('click', boardHandler);
  clearInterval(timer);

  const startAgainBtn = document.querySelector('#startAgain');
  startAgainBtn.addEventListener('click', (event) => {
    event.preventDefault();
    score = 0;
    board.innerHTML = '';
    timeEl.parentElement.classList.remove('hide');
    scoreEl.parentElement.classList.remove('hide');
    board.addEventListener('click', boardHandler);
    screens[1].classList.remove('up');
  });
}

function createRandomCircle() {
  if (document.querySelector('.circle')) document.querySelector('.circle').remove();
  const circle = document.createElement('div');
  const size = getRandomNumber(20, 60);
  const boardParams = board.getBoundingClientRect();
  // const { width, height } = board.getBoundingClientRect();

  const x = getRandomNumber(size / 2, boardParams.width - size / 2);   // parseInt(getComputedStyle(board).width
  const y = getRandomNumber(size / 2, boardParams.height - size / 2);  // parseInt(getComputedStyle(board).height
  circle.classList.add('circle');
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
  circle.style.background = colors[getRandomNumber(0, colors.length - 1)];

  board.append(circle);

  let promise = new Promise(function (resolve) {
    setTimeout(() => {
      circle.style.width = circle.style.height = `${size}px`;
      resolve();
    }, 0);
  })
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          circle.style.width = circle.style.height = 0;
          resolve();
        }, 2000);
      });
    })
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          circle.remove();
          resolve();
        }, 2000);
      });
    });
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}