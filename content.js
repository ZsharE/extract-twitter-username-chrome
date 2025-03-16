function extractTwitterUsernames() {
  var result = [];
  if (result.length === 0) {
    $("meta[name='twitter:creator'], meta[name='x:creator']").each(function(meta) {
      var content = this.content;
      if (content !== null && content.startsWith("@")) {
        if (content.substring(1).includes('twitter.com') || content.substring(1).includes('x.com')) {
          var usernameMatch = decodeURIComponent(content.substring(1)).match(/(twitter\.com|\/x\.com)\/(?:@){0,1}(\w*)/);
          if (usernameMatch !== null && usernameMatch[2] !== "") {
            result.push(usernameMatch[2]);
            return;
          }
        }

        if (content.substring(1)) {
          result.push(content.substring(1));
          return;
        }
      }
    });
    
    $("a[href*='twitter' i], a[href*='x' i]").each(function(index, link) {
      var url = this.href;
      var usernameMatch = decodeURIComponent(url).match(/(twitter\.com|\/x\.com)\/(?:@){0,1}(\w*)/);

      if (usernameMatch !== null && usernameMatch[2] !== "" && !["intent", "search", "share", "home"].includes(usernameMatch[2])) {
        result.push(usernameMatch[2]);
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
    $("iframe[id*='twitter-widget-'], iframe[id*='x-widget-']").each(function(iframe) {
      var widgetId = this.dataset.widgetId;
      var screenName = this.dataset.screenName;

      if (widgetId) {
        var profileMatch = widgetId.match(/profile:(\w*)/);
        if (profileMatch !== null && profileMatch[1] !== "") {
          result.push(profileMatch[1]);
          return;
        }
      }

      if (screenName) {
        result.push(screenName);
        return;
      }
    });
  }

  return result.map(function(i) { return i.toLowerCase(); }).filter(function(item, i, ar) { return ar.indexOf(item) === i; });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "getTwitterUsernames")
    sendResponse({ usernames: extractTwitterUsernames() });
  else
    sendResponse({});
});