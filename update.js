'use strict';

var fs = require('fs'),
    request = require('request'),
    version = parseInt(require('./package.json').version);

function fromCodePoint(codepoint) {
  var code = typeof codepoint === 'string' ? parseInt(codepoint, 16) : codepoint;
  if (code < 0x10000) return String.fromCharCode(code);
  code -= 0x10000;
  return String.fromCharCode(0xD800 + (code >> 10), 0xDC00 + (code & 0x3FF));
}

var previewUrl = 'http://twitter.github.io/twemoji/' + version + '/test/preview.html';

request.get(previewUrl, function(err, res, data) {
  if (err || res.statusCode !== 200) {
    console.error("Something goes wrong when downloading the preview page.", e);
    process.exit(-1);
  }
  console.log("emoji list loaded, parsing and saving...");
  try {
    var str = data.substr(data.indexOf('<ul class="emoji-list">') + 23);
    str = str.substr(0, str.indexOf('</ul>')).trim();
    var regex = /<li>(.+?)<\/li>/g;
    var emojisList = [];
    while (true) {
      var match = regex.exec(str);
      if (!match) break;
      emojisList.push(match[1]);
    }
    emojisList = emojisList.map(function(encStr) {
      var regex = /&#x([0-9A-F]+?);/g;
      var s = '';
      while (true) {
        var match = regex.exec(encStr);
        if (!match) break;
        s += fromCodePoint(match[1]);
      }
      return s;
    });
    fs.writeFileSync('index.js', "module.exports = " + JSON.stringify(emojisList, null, 2), 'utf8');
    console.log('done..');
    process.exit(0);
  } catch(e) {
    console.error("Error parsing emoji list html.", e);
    process.exit(-1);
  }
});
