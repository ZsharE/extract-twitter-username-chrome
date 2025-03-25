function extractTwitterUsernames() {
  var result = [];
  if (result.length === 0) {
    $("meta[name='twitter:creator'], meta[name='x:creator']").each(function(meta) {
      var content = this.content;
      if (content !== null && content.startsWith("@")) {
        if (content.substring(1).includes('twitter.com') || content.substring(1).includes('x.com')) {
          var usernameMatch = decodeURIComponent(content.substring(1)).match(/(twitter\.com|\/x\.com)\/(?:@){0,1}(\w*)/);
          if (usernameMatch !== null && usernameMatch[2] !== "") {
            result.push({ name: usernameMatch[2], icon: "twitter" });
            return;
          }
        }

        if (content.substring(1)) {
          result.push({ name: content.substring(1), icon: "twitter" });
          return;
        }
      }
    });
    
    $("a[href*='twitter' i], a[href*='x' i]").each(function(index, link) {
      var url = this.href;
      var usernameMatch = decodeURIComponent(url).match(/(twitter\.com|\/x\.com)\/(?:@){0,1}(\w*)/);

      if (usernameMatch !== null && usernameMatch[2] !== "" && !["intent", "search", "share", "home"].includes(usernameMatch[2])) {
        result.push({ name: usernameMatch[2], icon: "twitter" });
        return;
      }
  
      var viaMatch = url.match(/via[%20@|=](\w*)/);
      if (viaMatch !== null && viaMatch[1] !== "") {
        result.push({ name: viaMatch[1], icon: "twitter" });
        return;
      }
  
      var screenNameMatch = url.match(/screen_name=(\w*)/);
      if (screenNameMatch !== null && screenNameMatch[1] !== "") {
        result.push({ name: screenNameMatch[1], icon: "twitter" });
        return;
      }
    });

    $("iframe[id*='twitter-widget-'], iframe[id*='x-widget-']").each(function(iframe) {
      var widgetId = this.dataset.widgetId;
      var screenName = this.dataset.screenName;

      if (widgetId) {
        var profileMatch = widgetId.match(/profile:(\w*)/);
        if (profileMatch !== null && profileMatch[1] !== "") {
          result.push({ name: profileMatch[1], icon: "twitter" });
          return;
        }
      }

      if (screenName) {
        result.push({ name: screenName, icon: "twitter" });
        return;
      }
    });

    $("a[href*='bsky.app' i]").each(function(index, link) {
      var url = this.href;
      var usernameMatch = decodeURIComponent(url).match(/(bsky\.app)\/{0,1}(\w*)\/{0,1}([\s\S]*)/);

      if (usernameMatch !== null && usernameMatch[3] !== "") {
        result.push({ name: usernameMatch[3], icon: "bluesky" });
        return;
      }
    });
  }

  return result.filter((item, index, ar) => ar.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase() && i.icon === item.icon) === index);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "getTwitterUsernames")
    sendResponse({ usernames: extractTwitterUsernames() });
  else
    sendResponse({});
});