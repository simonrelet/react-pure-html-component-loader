'use strict';

const htmlParser = require('htmlparser2');

const loggers = require('../loggers');

const types = {
  TAG: 'tag',
  TEXT: 'text'
};

const htmlParserOptions = { xmlMode: true };

function createHandler(verbosity) {
  return {
    line: 0,
    current: undefined,
    roots: [],
    logger: loggers(loggers.levels[verbosity]),

    onopentag,
    ontext,
    onclosetag,
    onerror,
    getResult,
    nextLine
  };
}

function onopentag(name, attributes) {
  this.logger.log(`onopentag: ${name}, ${loggers.str(attributes)}`);

  const child = {
    type: types.TAG,
    name,
    parent: this.current,
    attrs: attributes,
    children: [],
    meta: { line: this.line }
  };

  if (this.current) {
    this.current.children.push(child);
  }
  this.current = child;
}

function ontext(text) {
  const value = text.trim();
  if (value !== '') {
    this.logger.log(`ontext: ${loggers.str(text)}`);

    if (this.current) {
      this.current.children.push({
        type: types.TEXT,
        value,
        children: [],
        meta: { line: this.line }
      });
    }
  }
}

function onclosetag(name) {
  this.logger.log(`onclosetag: ${name}`);

  if (this.current && this.current.parent) {
    const parent = this.current.parent;
    this.current.parent = undefined;
    this.current = parent;
  } else {
    this.roots.push(this.current);
    this.current = undefined;
  }
}

function onerror(err) {
  this.logger.log(`onerror: ${loggers.str(err)}`);
}

function getResult() {
  return { roots: this.roots };
}

function nextLine() {
  this.line++;
}

/**
 * @typedef  {object} AST
 * @property {Node[]} roots  The root nodes
 */

/**
 * @typedef  {TagNode|TextNode} Node
 * @property {string} type The type of the node
 */

/**
 * @typedef  {object} TagNode
 * @property {string} name      The tag name
 * @property {object} attrs     The attributes
 * @property {Node[]} children  The children
 */

/**
 * @typedef  {object} TextNode
 * @property {string} value  The text value
 */

/**
 * @typedef  {object} HTAOptions
 * @property {string} html              The HTML
 * @property {string} [verbosity=NONE]  The verbosity level. One of NONE, LOG,
 *                                      WARNING, ERROR
 */

/**
 * Parses an HTML and return its corresponding AST.
 *
 * @param  {HTAOptions} options  The options
 * @return {AST}                 The AST
 */
function htmlToAst(options) {
  const handler = createHandler(options.verbosity);
  const parser = new htmlParser.Parser(handler, htmlParserOptions);

  options.html.split(/\n\r?/).forEach(line => {
    handler.nextLine();
    parser.write(line);
  });

  parser.end();
  return handler.getResult();
}

module.exports = htmlToAst;
module.exports.types = types;
