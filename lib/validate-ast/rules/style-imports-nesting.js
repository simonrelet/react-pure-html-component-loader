'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;

function importSubTree(node) {
  if (node.children.length > 0) {
    return result.withError(
      `A style import cannot have children, found ${node.children.length}`,
      node.meta.line
    );
  }

  return result.empty();
}

function importsNesting(ast) {
  return ast
    .filter(node => (
      node.name === constants.tags.IMPORT
        && node.attrs[importAttrs.TYPE] === importAttrs.types.STYLESHEET
    ))
    .map(importSubTree)
    .reduce(result.reducer, result.empty());
}

module.exports = importsNesting;
