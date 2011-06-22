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
    '([^?#]+)?' +                         // path
    '(?:\\?([^#]*))?' +                   // query
    '(?:#(.*))?' +                        // fragment
    '$');

function endsWith(str, suffix) {
  var l = str.length - suffix.length;
  return l >= 0 && str.indexOf(suffix, l) == l;
}

function startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) == 0;
}

function App(appId) {
  this.appId = appId;
  this.storeUrl = 'https://chrome.google.com/webstore/detail/' + appId;
}

App.fromUrl = function(url) {
  var urlParts = url.match(URL_RE_);
  var urlHostname = urlParts[3];
  var urlPath = urlParts[5];

  for (var appId in URL_PATTERNS) {
    var appPattern = URL_PATTERNS[appId];
    var appHostname = appPattern[0];
    var appPath = appPattern[1];

    if (endsWith(urlHostname, appHostname) &&
        (!appPath || startsWith(urlPath, appPath))) {
      return new App(appId);
    }
  }

  return undefined;
};
