# Introduction

"There's a web app for that" is a Chrome extension that suggests [Chrome Web Store](http://chrome.google.com/webstore) apps that you may want to install. It has two UIs:

 * A page action (a blue [+] icon) shows up on sites that have a corresponding Chrome Web Store entry.
 * The options page (shown when the extension is first installed) shows sites from your browser history that have a Chrome Web Store entry.

## Matching up sites and Chrome Web Store entries

The extension includes a dump of the top ~1000 web store apps (see `extension/app-data.js`). For each app there is a set of URL patterns that it should match. This data is derived from the [`urls` section](http://code.google.com/chrome/apps/docs/developers_guide.html#manifest) in the apps' manifest. This means that no personal data is sent to the Chrome Web Store (or any other server) to see if a URL correponds to a store entry.
