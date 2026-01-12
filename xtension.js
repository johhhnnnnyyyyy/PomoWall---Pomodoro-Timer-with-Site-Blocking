let timer={
  isRunning: false,
  isPaused: false,
  session:'focus',
  timeLeft: 25*60,
  totalTime: 25*60
};
let updateInterval=null;

const slides=document.querySelectorAll('.slide');
const arrows=document.querySelectorAll('.A');
let currSlide=0;
const totalSlide=3;  //focus=0,short break=1,long break=2

//loading
document.addEventListener('DOMContentLoaded', () => {
  loadTimerState();
  loadBlockedSites();
  startSync();
});
function loadTimerState(){
  chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' }, (response) => {
    timer = response.timer;
    timeLeft = timer.timeLeft;
    isTimer = timer.isRunning;
    isPlaying = timer.isRunning && !timer.isPaused;
      
    const sessions = { focus:0, shortBreak:1, longBreak:2 };
    currSlide = sessions[timer.session];
    slides.forEach(s => s.classList.remove('active'));
    slides[currSlide].classList.add('active');
      
    updateDisplay();
  });
}

function loadBlockedSites(){
  chrome.runtime.sendMessage({ type: 'GET_BLOCKED_SITES' }, (response) => {
    sitesList.innerHTML = '';
    response.sites.forEach(site => {
      addSiteToPage(site);
    });
  });
}
function addSiteToPage(site){
  const listItem=document.createElement('li');
  listItem.textContent=site;

  const del= document.createElement('span');
  del.classList.add('material-symbols-outlined','delete');
  del.textContent='delete';
  del.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'REMOVE_SITE', site }, (response) => {
      if (response.success){
        listItem.remove();
      }
    });
  });
  listItem.appendChild(del);
  sitesList.appendChild(listItem);
}

function startSync(){
  updateInterval = setInterval(() => {
    chrome.runtime.sendMessage({ type: 'GET_TIMER_STATE' }, (response) => {
      if(response && response.timer){
        timer = response.timer;
        timeLeft = timer.timeLeft;
        updateDisplay();
      }
    }) ;
  }, 1000);

  window.addEventListener('beforeunload', () => {
    if(updateInterval){
      clearInterval(updateInterval);
    }
  });
}

//slide navigation
function changeSession(){
  const sessionTypes = ['focus', 'shortBreak', 'longBreak'];
  chrome.runtime.sendMessage({ 
    type: 'CHANGE_SESSION', 
    session: sessionTypes[currSlide] 
  }, (response) => {
    timer = response.timer;
    timeLeft = timer.timeLeft;
    updateDisplay();
  });
}

function prevSlide(){
  if(isTimer) return;   //critical bug reported fixed here and below

  slides[currSlide].classList.remove('active');
  currSlide=(currSlide-1+totalSlide)%3;
  slides[currSlide].classList.add('active');
  
  changeSession();
}
function nextSlide(){
  if(isTimer) return;

  slides[currSlide].classList.remove('active');
  currSlide=(currSlide+1)%3;
  slides[currSlide].classList.add('active');
  
  changeSession();
}

//settings slide
const sett=document.querySelectorAll('.setting');
const inSites=document.querySelector('.input');
const sitesList=document.querySelector('.sites-list');
sett.forEach(setting => {
  setting.addEventListener('click', () => {
    if(isTimer) return;
    slides[currSlide].classList.remove('active');
    currSlide=3;
    slides[currSlide].classList.add('active');
  });
});

function addSite(site){
  if(site.trim()==='') return;
  
  const URLregex = /^[a-zA-Z0-9]+\.[a-zA-Z]{2,}/
  if(!URLregex.test(site.toLowerCase())){
    alert('Enter a valid site (e.g., example.com)');
    return;
  }
  chrome.runtime.sendMessage({ type: 'ADD_SITE', site: site.toLowerCase() }, (response) => {
    if (response.success){
      addSiteToPage(site.toLowerCase());
    } else{
      alert(response.error || 'Site already blocked');
    }
  });
}
if(inSites){
  inSites.addEventListener('keydown', (press) => {
    if(press.key === 'Enter'){
      addSite(inSites.value);
      inSites.value='';
    }
  })
}

if(slides[3]){
  const back = slides[3].querySelector('.back');
  back.addEventListener('click', () => {
    slides[currSlide].classList.remove('active');
    currSlide=0;
    slides[currSlide].classList.add('active');
  });
}



arrows.forEach(arrow => {
  arrow.addEventListener('click',()=>{
    if(arrow.classList.contains('left'))        prevSlide();
    else if(arrow.classList.contains('right'))  nextSlide();
  })
});

const TIMERS = {
  focus: 25*60,
  shortBreak: 5*60,
  longBreak: 15*60
}

let timeLeft = TIMERS.focus;
let isPlaying = false;
let isTimer = false;
let timerInterval = null;
const plays = document.querySelectorAll('.play');
const resets = document.querySelectorAll('.reset');

resets.forEach(reset => {
  reset.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'RESET_TIMER' }, (response) => {
      timer = response.timer;
      timeLeft = timer.timeLeft;
      isPlaying = false;
      isTimer = false;
      updateDisplay();
    });
  });
});

function pause(){
  chrome.runtime.sendMessage({ type: 'PAUSE_TIMER' }, (response) => {
    timer = response.timer;
    isPlaying = false;
  });
}
function play(){
  if(isPlaying) return;

  const sessionTypes = ['focus', 'shortBreak', 'longBreak'];
  chrome.runtime.sendMessage({
    type: 'START_TIMER',
    session: sessionTypes[currSlide]
  }, (response) => {
    timer = response.timer;
    timeLeft = timer.timeLeft;
    isPlaying = true;
    isTimer = true;
  });
}

plays.forEach(playIsFunctionNameSoImDoingThis => {       // sorry for the variable name :)
  playIsFunctionNameSoImDoingThis.addEventListener('click',()=>{
    if(isPlaying) pause();
    else play();
  });
});

function updateDisplay(){
  let time;
  if(isTimer) time = timeLeft;
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