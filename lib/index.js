/* eslint no-console: "off" */
'use strict';

const htmlToJs = require('./html-to-js');
const jsToReact = require('./js-to-react');

/**
 * The result object.
 *
 * @typedef {object} Result
 *
 * @property {string} react  The React component
 */

/**
 * The options object.
 *
 * @typedef {object} Options
 *
 * @property {string} html              The HTML
 * @property {string} [verbosity=NONE]  The verbosity level. One of NONE, LOG,
 *                                      WARNING, ERROR
 */

/**
 * Compiles an HTML to a React component.
 *
 * @param  {Options} options  The options
 * @return {Result}           The React component as a string
 */
module.exports = function(options) {
  const ast = htmlToJs(options);
  const reactStr = jsToReact(ast);
  return { react: reactStr };
};
