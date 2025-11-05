chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "analyze") {
    let text = document.body.innerText;
    sendResponse({text: text});
  }
  return true;  // Indicates that the response is sent asynchronously
});