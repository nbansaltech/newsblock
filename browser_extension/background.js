chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
      chrome.tabs.executeScript(
        {code: 'document.body.innerText'},
        (result) => {
          if (chrome.runtime.lastError) {
            sendResponse({error: chrome.runtime.lastError.message});
          } else {
            sendResponse({text: result[0]});
          }
        }
      );
      return true;  // Will respond asynchronously
    }
  });
  