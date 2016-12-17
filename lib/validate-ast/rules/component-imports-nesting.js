'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;

function importSubTree(node) {
  const mapper = child => {
    if (child.name !== constants.tags.IMPORT) {
      return result.withError(
        'Only named component imports are allowed in an component import',
        child.meta.line
      );
    }
    if (child.children.length > 0) {
      return result.withError(
        'A named component imports should not have children',
        child.meta.line
      );
    }
    return result.empty();
  };

  return node.children
    .map(mapper)
    .reduce(result.reducer, result.empty());
}

function importsNesting(ast) {
  return ast
    .filter(node => (
      node.name === constants.tags.IMPORT
        && node.attrs[importAttrs.TYPE] === importAttrs.types.COMPONENT
    ))
    .map(importSubTree)
    .reduce(result.reducer, result.empty());
}

module.exports = importsNesting;
