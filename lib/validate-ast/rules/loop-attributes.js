'use strict';

const constants = require('../../constants');
const result = require('../result');

const controlAttrs = constants.attributes.controls;

function loopAttributes(node) {
  let res = result.empty();

  if (node.name === constants.tags.CONTROLS
    && node.attrs.hasOwnProperty(controlAttrs.LOOP_ARRAY)
    && !node.attrs[controlAttrs.LOOP_VAR_NAME]) {
    res = result.withError(
      `A loop must have the attribute '${controlAttrs.LOOP_VAR_NAME}'`,
      node.meta.line
    );
  }

  return node.children
    .map(loopAttributes)
    .reduce(result.reducer, res);
}

module.exports = function(ast) {
  return ast
    .map(loopAttributes)
    .reduce(result.reducer, result.empty());
};
