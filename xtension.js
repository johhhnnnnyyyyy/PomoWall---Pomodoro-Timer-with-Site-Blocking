//code for switching slides

const slides=document.querySelectorAll('.slide');
const arrows=document.querySelectorAll('.A');
let currSlide=0;
const totalSlide=3;  //focus=0,short break=1,long break=2

function prevSlide(){
  if(isTimer) return;   //critical bug reported fixed here and below

  slides[currSlide].classList.remove('active');
  currSlide=(currSlide-1+totalSlide)%3;
  slides[currSlide].classList.add('active');
  updateDisplay();
}
function nextSlide(){
  if(isTimer) return;

  slides[currSlide].classList.remove('active');
  currSlide=(currSlide+1)%3;
  slides[currSlide].classList.add('active');
  updateDisplay();
}

arrows.forEach(arrow => {
  arrow.addEventListener('click',()=>{
    if(arrow.classList.contains('left'))        prevSlide();
    else if(arrow.classList.contains('right'))  nextSlide();
  })
});

const TIMERS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
}

let timeLeft = TIMERS.focus;
let isPlaying = false;
let isTimer = false;
let timerInterval = null;
const plays = document.querySelectorAll('.play');
const resets = document.querySelectorAll('.reset');

resets.forEach(reset => {
  reset.addEventListener('click', () => {
    pause();    //MUST TO STOP THE TIMER
    isTimer = false;

    if(currSlide === 0) timeLeft = TIMERS.focus;
    else if(currSlide === 1) timeLeft = TIMERS.shortBreak;
    else if(currSlide === 2) timeLeft = TIMERS.longBreak;

    updateDisplay();
  });
});

function pause(){
  isPlaying = false;
  clearInterval(timerInterval);
}
function play(){
  if(isPlaying) return;

  isPlaying = true;

  if(!isTimer){
    isTimer = true;

    if(currSlide === 0) timeLeft = TIMERS.focus;
    else if(currSlide === 1) timeLeft = TIMERS.shortBreak;
    else if(currSlide === 2) timeLeft = TIMERS.longBreak;
  }

  timerInterval = setInterval(() => {
    if(timeLeft > 0){
      timeLeft--;
      updateDisplay();
    }
    else{
      pause();
      isTimer = false;
      alert("Time's up!");
    }
  }, 1000);
}

plays.forEach(playIsFunctionNameSoImDoingThis => {       // sorry for the variable name :)
  playIsFunctionNameSoImDoingThis.addEventListener('click',()=>{
    if(isPlaying) pause();
    else play();
  });
});

function updateDisplay(){
  let time;
  if(isPlaying) time = timeLeft;
  else{
    if(currSlide === 0) time = TIMERS.focus;
    else if(currSlide === 1) time = TIMERS.shortBreak;
    else if(currSlide === 2) time = TIMERS.longBreak;
  }

  const mins = String(Math.floor(time/60)).padStart(2,'0');
  const secs = String(time%60).padStart(2,'0');
  slides[currSlide].querySelector('.time').innerHTML = `${mins}<br>${secs}`;
}
updateDisplay();