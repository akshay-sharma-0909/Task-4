let timeSpent = {}; // Object to store time spent on each website
let currentTabId = null; // To track the current tab

// On tab change, start tracking time for the new tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  currentTabId = activeInfo.tabId;
  startTracking(currentTabId);
});

// On tab update (like page load or navigation), track time spent
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId === currentTabId && changeInfo.status === "complete") {
    startTracking(tabId);
  }
});

// Function to start time tracking
function startTracking(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    const url = new URL(tab.url);
    const domain = url.hostname;

    if (!timeSpent[domain]) {
      timeSpent[domain] = 0; // Initialize time spent for this domain
    }

    trackTime(domain);
  });
}

// Function to track time for a specific domain
function trackTime(domain) {
  let startTime = Date.now(); // Time when tracking starts

  // Check every second
  setInterval(() => {
    let currentTime = Date.now();
    let elapsedTime = currentTime - startTime;

    timeSpent[domain] = Math.floor(elapsedTime / 1000); // Store time in seconds
    console.log(`Time spent on ${domain}: ${timeSpent[domain]} seconds`);
  }, 1000);
}

// Saving the time data to Chrome storage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTimeSpent") {
    sendResponse(timeSpent); // Send the time spent data
  }
});
