// From Closure's goog/uri/utils.js

var URL_RE_ = new RegExp(
    '^' +
    '(?:' +
      '([^:/?#.]+)' +                     // scheme - ignore special characters
                                          // used by other URL parts such as :,
                                          // ?, /, #, and .
    ':)?' +
    '(?://' +
      '(?:([^/?#]*)@)?' +                 // userInfo
      '([\\w\\d\\-\\u0100-\\uffff.%]*)' + // domain - restrict to letters,
                                          // digits, dashes, dots, percent
                                          // escapes, and unicode characters.
      '(?::([0-9]+))?' +                  // port
    ')?' +
    '([^?#]+)?');                         // path

function endsWith(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
}

function startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
}

function App(appData) {
  this.appId = appData.app_id;
  this.ignoredLocalStorageKey = 'ignored-' + this.appId;
  this.title = appData.title;
  this.iconUrl = appData.icon_url;
  this.matchUrls_ = appData.match_urls;
}

App.prototype.getStoreUrl = function() {
  return 'https://chrome.google.com/webstore/detail/' + this.appId;
};

App.prototype.matchesUrl = function(urlHostname, urlPath) {
  for (var i = 0, matchUrl; matchUrl = this.matchUrls_[i]; i++) {
    var matchHostname = matchUrl[0];
    var matchPath = matchUrl[1];

    if ((urlHostname == matchHostname || endsWith(urlHostname, '.' + matchHostname)) &&
        (!matchPath || startsWith(urlPath, matchPath))) {
      return true;
    }
  }

  return false;
};

App.prototype.isIgnored = function() {
  return this.ignoredLocalStorageKey in localStorage;
};

App.prototype.setIsIgnored = function(value) {
  if (value) {
    localStorage[this.ignoredLocalStorageKey] = 1;
  } else {
    delete localStorage[this.ignoredLocalStorageKey];
  }
}

App.cacheByUrlKey_ = {};

App.fromUrl = function(url) {
  if (!App.apps_) {
    App.parseAppData_();
  }

  var urlParts = url.match(URL_RE_);
  var urlScheme = urlParts[1];

  if (urlScheme != 'http' && urlScheme != 'https') return undefined;

  var urlHostname = urlParts[3];
  var urlPath = urlParts[5];

  if (!urlHostname) return;

  var cacheKey = urlHostname + urlPath;

  if (cacheKey in App.cacheByUrlKey_) {
    return App.cacheByUrlKey_[cacheKey];
  }

  for (var i = 0, app; app = App.apps_[i]; i++) {
    if (app.matchesUrl(urlHostname, urlPath)) {
      return App.cacheByUrlKey_[cacheKey] = app;
    }
  }

  return App.cacheByUrlKey_[cacheKey] = undefined;
};

App.parseAppData_ = function() {
  App.apps_ = [];
  for (var i = 0, appData; appData = APP_DATA[i]; i++) {
    App.apps_.push(new App(appData));
  }
}
