document.getElementById('refreshButton').addEventListener('click', () => {
    // Send message to background to get the time spent
    chrome.runtime.sendMessage({ action: "getTimeSpent" }, (response) => {
      const timeSpent = response;
      let timeString = "Time spent on websites:\n";
      
      // Format the time spent on each website
      for (const domain in timeSpent) {
        timeString += `${domain}: ${timeSpent[domain]} seconds\n`;
      }
  
      document.getElementById('time').innerText = timeString;
    });
  });
  