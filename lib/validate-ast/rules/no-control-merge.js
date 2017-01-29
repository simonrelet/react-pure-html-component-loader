'use strict';

const constants = require('../../constants');
const result = require('../result');

const controlAttrs = constants.attributes.controls;

function noControlMerge(node) {
  let res = result.empty();

  if (node.name === constants.tags.CONTROLS
    && node.attrs.hasOwnProperty(controlAttrs.LOOP_ARRAY)
    && node.attrs.hasOwnProperty(controlAttrs.CONDITIONALS_TEST)) {
    res = result.withError(
      `A '<${constants.tags.CONTROLS}>' must either be a conditional or a loop,`
      + ' but not both',
      node.meta.line
    );
  }

  return node.children
    .map(noControlMerge)
    .reduce(result.reducer, res);
}

module.exports = function(ast) {
  return ast
    .map(noControlMerge)
    .reduce(result.reducer, result.empty());
};
