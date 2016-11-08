/* eslint no-console: "off" */
'use strict';

const astToReact = require('./ast-to-react');
const validateAst = require('./validate-ast');
const htmlToAst = require('./html-to-ast');

/**
 * The result object.
 *
 * @typedef  {object} Result
 * @property {string} reactStr  The React component
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
 * @return {Result}           The conversion result
 */
module.exports = function(options) {
  const ast = htmlToAst(options);
  const validation = validateAst(ast.roots);

  const warnings = validation.warnings;
  const errors = validation.errors;

  if (errors.length > 0) {
    return { errors, warnings, reactStr: '' };
  }

  const reactStr = astToReact(ast);
  return { reactStr, warnings, errors: [] };
};
