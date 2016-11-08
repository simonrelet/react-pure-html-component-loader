'use strict';

const htmlToReact = require('../lib');

function formatMessage(obj) {
  if (typeof obj.line !== 'undefined') {
    return `  Line ${obj.line}:  ${obj.message}`;
  }
  return `  ${obj.message}`;
}

module.exports = function(content) {
  this.cacheable();

  const res = htmlToReact({ html: content });

  res.errors.forEach(err => {
    this.emitError(formatMessage(err));
  });

  res.warnings.forEach(warn => {
    this.emitWarning(formatMessage(warn));
  });

  return res.reactStr;
};
