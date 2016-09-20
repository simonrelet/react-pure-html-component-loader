'use strict';

const htmlparser2 = require('htmlparser2');

const loggers = require('../loggers');

const types = {
  TAG: 'tag',
  TEXT: 'text'
};

const htmlparser2Options = {
  recognizeSelfClosing: true
};

function Handler(verbosity) {
  this.current = undefined;
  this.roots = [];
  this.logger = loggers(loggers.levels[verbosity]);
}

Handler.prototype.onopentag = function(name, attributes) {
  this.logger.log(`onopentag: ${name}, ${loggers.str(attributes)}`);

  const child = {
    type: types.TAG,
    name,
    parent: this.current,
    attrs: attributes,
    children: []
  };

  if (this.current) {
    this.current.children.push(child);
  }
  this.current = child;
};

Handler.prototype.ontext = function(text) {
  const value = text.trim();
  if (value !== '') {
    this.logger.log(`ontext: ${loggers.str(text)}`);

    if (this.current) {
      this.current.children.push({
        type: types.TEXT,
        value
      });
    }
  }
};

Handler.prototype.onclosetag = function(name) {
  this.logger.log(`onclosetag: ${name}`);

  if (this.current && this.current.parent) {
    const parent = this.current.parent;
    this.current.parent = undefined;
    this.current = parent;
  } else {
    this.roots.push(this.current);
    this.current = undefined;
  }
};

Handler.prototype.onerror = function(err) {
  this.logger.log(`onerror: ${loggers.str(err)}`);
};

Handler.prototype.getResult = function() {
  return { roots: this.roots };
};

function parse(options) {
  const handler = new Handler(options.verbosity);
  const parser = new htmlparser2.Parser(handler, htmlparser2Options);

  parser.write(options.html);
  parser.end();
  return handler.getResult();
}

module.exports = parse;
module.exports.types = types;
