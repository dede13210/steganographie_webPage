
document.getElementById("urlInput").addEventListener("input", function(event) {
  var url = event.target.value;
  chrome.runtime.sendMessage({action: "addUrl", url: url}, function(response) {
    console.log(response.status);
  });
});

function blockUrl() {
  var url = document.getElementById("urlInput").value;
  chrome.runtime.sendMessage({action: "addUrl", url: url}, function(response) {
    console.log(response.status);
  });
}