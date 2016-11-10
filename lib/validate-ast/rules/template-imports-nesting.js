'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;

function importSubTree(node) {
  const mapper = child => {
    if (child.name !== constants.tags.IMPORT) {
      return result.withError(
        'Only named template imports are allowed in an template import',
        child.meta.line
      );
    }
    if (child.children.length > 0) {
      return result.withError(
        'A named template imports should not have children',
        child.meta.line
      );
    }
    return result.empty();
  };

  return node.children
    .map(mapper)
    .reduce((acc, res) => acc.concat(res), result.empty());
}

function importsNesting(ast) {
  return ast
    .filter(node => (
      node.name === constants.tags.IMPORT
        && node.attrs[importAttrs.TYPE] === importAttrs.types.COMPONENT
    ))
    .map(importSubTree)
    .reduce((acc, res) => acc.concat(res), result.empty());
}

module.exports = importsNesting;
