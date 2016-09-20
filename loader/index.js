'use strict';

const htmlToReact = require('../lib');

module.exports = function(content) {
  this.cacheable();
  const res = htmlToReact({ html: content });
  return res.react;
};
