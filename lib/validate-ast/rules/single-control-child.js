'use strict';

const constants = require('../../constants');
const result = require('../result');

function singleControlChild(node) {
  let res = result.empty();

  if (node.name === constants.tags.CONTROLS && node.children.length !== 1) {
    res = result.withError(
      `A '<${constants.tags.CONTROLS}>' must have exactly one child, found`
      + ` ${node.children.length}`,
      node.meta.line
    );
  }

  return node.children
    .map(singleControlChild)
    .reduce(result.reducer, res);
}

module.exports = function(ast) {
  return ast
    .map(singleControlChild)
    .reduce(result.reducer, result.empty());
};
