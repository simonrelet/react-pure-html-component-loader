/* eslint no-console: "off" */
'use strict';

const astToReact = require('./ast-to-react');
const htmlToAst = require('./html-to-ast');

/**
 * The result object.
 *
 * @typedef  {object} Result
 * @property {string} react  The React component
 */

/**
 * The options object.
 *
 * @typedef  {object} Options
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
  const ast = htmlToAst(options);
  const reactStr = astToReact(ast);
  return { react: reactStr };
};
