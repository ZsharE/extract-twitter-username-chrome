function extractTwitterUsernames() {
  var result = [];
  $("meta[name='twitter:creator']").each(function(meta) {
    var content = this.content;
    if (content !== null && content.startsWith("@")) {
      result.push(content.substring(1));
      return;
    }
  });
  if (result.length === 0) {
    $("a[href*='twitter']").each(function(link) {
      var url = this.href;
  
      var usernameMatch = url.match(/twitter.com\/(?:@){0,1}(\w*)/)
      if (usernameMatch !== null && usernameMatch[1] !== "" && !["intent", "search", "share", "home"].includes(usernameMatch[1])) {
        result.push(usernameMatch[1]);
        return;
      }
  
      var viaMatch = url.match(/via[%20@|=](\w*)/);
      if (viaMatch !== null && viaMatch[1] !== "") {
        result.push(viaMatch[1]);
        return;
      }
  
      var screenNameMatch = url.match(/screen_name=(\w*)/);
      if (screenNameMatch !== null && screenNameMatch[1] !== "") {
        result.push(screenNameMatch[1]);
        return;
      }
    });
    $("iframe[id*='twitter-widget-']").each(function(iframe) {
      var widgetId = this.dataset.widgetId;

      var profileMatch = widgetId.match(/profile:(\w*)/);
      if (profileMatch !== null && profileMatch[1] !== "") {
        result.push(profileMatch[1]);
        return;
      }
    });
  }

  return result.map(function(i) { return i.toLowerCase(); }).filter(function(item, i, ar) { return ar.indexOf(item) === i; });
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
 if (request.action == "getTwitterUsernames")
   sendResponse({ usernames: extractTwitterUsernames() });
 else
   sendResponse({});
});
