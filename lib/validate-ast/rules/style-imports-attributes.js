'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;

function importAttributes(node) {
  if (!node.attrs[importAttrs.PATH]) {
    return result.withError(
      `A style import must have the attribute '${importAttrs.PATH}'`,
      node.meta.line
    );
  }

  return result.empty();
}

function importsAttributes(ast) {
  return ast
    .filter(node => (
      node.name === constants.tags.IMPORT
        && node.attrs[importAttrs.TYPE] === importAttrs.types.STYLESHEET
    ))
    .map(importAttributes)
    .reduce(result.reducer, result.empty());
}

module.exports = importsAttributes;
