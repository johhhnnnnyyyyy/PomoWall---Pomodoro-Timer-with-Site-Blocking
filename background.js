let blockedSites=[];
let timer={
  isRunning: false,
  isPaused: false,
  session:'focus',
  timeLeft: 25*60,
  totalTime: 25*60
}
const TIMERS={
  focus: 25*60,
  shortBreak: 5*60,
  longBreak: 15*60
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['blockedSites', 'timer'], (result) => {
    if (result.blockedSites){
      blockedSites = result.blockedSites;
    } else{
      chrome.storage.local.set({ blockedSites: [] });
    }
    
    if (result.timer){
      timer = result.timer;
    }
  });
});

// Load state on startup
chrome.storage.local.get(['blockedSites', 'timer'], (result) => {
  if (result.blockedSites){
    blockedSites = result.blockedSites;
  }
  if (result.timer){
    timer = result.timer;
    if (timer.isRunning && !timer.isPaused){
      startTimer();
    }
  }
});

//TIMER LOGIC

function startTimer(){
  chrome.alarms.create('pomoSec', { periodInMinutes: 1/60 });
  timer.isRunning = true;
  timer.isPaused = false;
  savetimer();

  if(timer.session === 'focus'){
    updateBlockingRules();
    chrome.action.setBadgeText({ text: '🔒' });
    chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
  }
}
function pauseTimer(){
  chrome.alarms.clear('pomoSec');
  timer.isPaused = true;
  savetimer();
}
function stopTimer(){
  chrome.alarms.clear('pomoSec');
  timer.isRunning = false;
  timer.isPaused = false;
  timer.timeLeft = timer.totalTime;
  savetimer();

  if(timer.session === 'focus'){
    clearBlockingRules();
    chrome.action.setBadgeText({ text: '' });
  }
}
function resetTimer(){
  chrome.alarms.clear('pomoSec');
  timer.isRunning = false;
  timer.isPaused = false;
  timer.timeLeft = TIMERS[timer.session];
  timer.totalTime = TIMERS[timer.session];
  savetimer();

  if(timer.session === 'focus'){
    clearBlockingRules();
    chrome.action.setBadgeText({ text: '' });
  }
}

// ALARM

chrome.alarms.onAlarm.addListener((alarm) => {
  if(alarm.name === 'pomoSec'){
    if(timer.timeLeft > 0){
      timer.timeLeft--;
      savetimer();

      const minutes = Math.floor(timer.timeLeft / 60);
      chrome.action.setBadgeText({ text: minutes.toString() });
    } else{
      chrome.alarms.clear('pomoSec');
      timer.isRunning = false;
      timer.isPaused = false;
      savetimer();

      clearBlockingRules();
      chrome.action.setBadgeText({ text: '' });

      chrome.notifications.create(
        {
          type: 'basic',
          title: "PomoWall Timer Completed!!!",
          message: timer.session === 'focus' 
            ? '🎉 Focus session complete! Have a break...have a kitkat 😉'
            : 'kitkat over! Time to get back to work! 💪',
          priority: 2
        });
    }
  }
});

function savetimer(){
  chrome.storage.local.set({ timer: timer });
}

// REQUESTS

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type === 'GET_TIMER_STATE'){
    sendResponse({ timer, blockedSites });
  }

  if (message.type === 'START_TIMER') {
    if (!timer.isRunning || timer.isPaused) {
      // If starting fresh, set the session type and duration
      if (!timer.isRunning) {
        timer.session = message.session;
        timer.timeLeft = TIMERS[message.session];
        timer.totalTime = TIMERS[message.session];
      }
      startTimer();
      sendResponse({ success: true, timer });
    }
  }

  if (message.type === 'PAUSE_TIMER') {
    pauseTimer();
    sendResponse({ success: true, timer });
  }

  if (message.type === 'RESET_TIMER') {
    resetTimer();
    sendResponse({ success: true, timer });
  }

  if (message.type === 'CHANGE_SESSION') {
    if (!timer.isRunning) {
      timer.session = message.session;
      timer.timeLeft = TIMERS[message.session];
      timer.totalTime = TIMERS[message.session];
      savetimer();
      sendResponse({ success: true, timer });
    } else {
      sendResponse({ success: false, error: 'Timer is running' });
    }
  }

  // BLOCKING

  if (message.type === 'GET_BLOCKED_SITES'){
    sendResponse({ sites: blockedSites });
  }
  //adding
  if (message.type === 'ADD_SITE'){
    const site = message.site.trim();
    if (site && !blockedSites.includes(site)){
      blockedSites.push(site);
      chrome.storage.local.set({ blockedSites }, () => {
        if (timer.isRunning && timer.session === 'focus'){
          updateBlockingRules();
        }
        sendResponse({ success: true });
      });
    } else{
      sendResponse({ success: false, error: 'Invalid or duplicate site' });
    }
    return true;
  }
  //removing
  if (message.type === 'REMOVE_SITE'){
    blockedSites = blockedSites.filter(s => s !== message.site);
    chrome.storage.local.set({ blockedSites }, () => {
      if (timer.isRunning && timer.session === 'focus'){
        updateBlockingRules();
      }
      sendResponse({ success: true });
    });
    return true;
  }

})

 async function updateBlockingRules(){
  if (blockedSites.length === 0) {
    clearBlockingRules();
    return;
  }

  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'block' },
    condition: {
      urlFilter: `*://*.${site}/*`,
      resourceTypes: ['main_frame']
    }
  }));

  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);
    
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: rules
  });
    
  console.log('✅ Blocking active:', rules.length, 'sites');
  console.log('Rules:', rules);
}

async function clearBlockingRules() {
  const rules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = rules.map(rule => rule.id);
    
  if (ruleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIds
    });
  }
    
  console.log('✅ Blocking disabled');
}