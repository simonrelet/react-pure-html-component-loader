'use strict';

const constants = require('../../constants');
const result = require('../result');

function singleChild(node) {
  if (node.children.length === 1) {
    return result.empty();
  }

  return result.withError(
    `A '<${constants.tags.COMPONENT}>' must have exactly one child, found`
    + ` ${node.children.length}`,
    node.meta.line
  );
}

module.exports = function(ast) {
  return ast
    .filter(node => node.name === constants.tags.COMPONENT)
    .map(singleChild)
    .reduce(result.reducer, result.empty());
};
