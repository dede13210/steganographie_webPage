
var blockedUrls = ["https://www.walibi.fr/fr"];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (shouldBlockUrl(details.url)) {
      return {cancel: true};
    }
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

function shouldBlockUrl(url) {
  return blockedUrls.some(function(blockedUrl) {
    return url.includes(blockedUrl);
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "addUrl") {
      blockedUrls.push(request.url);
      sendResponse({status: "Url blocked"});
    }
  }
);
