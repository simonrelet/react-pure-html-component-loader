/* eslint no-console: "off" */
'use strict';

const NONE = 10;
const LOG = 1;
const WARNING = 2;
const ERROR = 3;

function log(level) {
  return function() {
    if (level <= LOG) {
      console.log.apply(console, arguments);
    }
  };
}

function warn(level) {
  return function() {
    if (level <= WARNING) {
      console.warn.apply(console, arguments);
    }
  };
}

function error(level) {
  return function() {
    if (level <= ERROR) {
      console.error.apply(console, arguments);
    }
  };
}

function str(obj) {
  return JSON.stringify(obj, null, '  ');
}

module.exports = function(level) {
  level = level || NONE;
  return {
    log: log(level),
    warn: warn(level),
    error: error(level)
  };
};

module.exports.str = str;
module.exports.levels = {
  NONE,
  LOG,
  WARNING,
  ERROR
};
