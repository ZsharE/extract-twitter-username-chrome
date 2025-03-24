function copyToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}

$(function() {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    if (chrome.runtime.lastError) return;

    const tab = tabs[0];
    const icons = {
      "twitter": chrome.runtime.getURL("icons/twitter.svg"),
      "bluesky": chrome.runtime.getURL("icons/bluesky.svg")
    };

    chrome.tabs.sendMessage(tab.id, { action: "getTwitterUsernames" }, (response) => {
      if (chrome.runtime.lastError) return;

      console.log(response && response.usernames);

      if (response && response.usernames && response.usernames.length > 0) {
        copyToClipboard(response.usernames[0]);
        response.usernames.forEach(function(username) {
          $("#usernames").append("<li><span class='icon'><img src='" + icons[username.icon] + "' alt='" + username.icon + "'></span><span>" + username.name + "</span><button>Copy</button></li>");
        });

        // copy button event listener
        $('#usernames').on("click", "li button", function(e) {
          copyToClipboard(e.target.parentElement.querySelector('span').innerText);
        });
      } else {
        $("#usernames").append("<li>Not found</li>");
      }
    });
  });
});