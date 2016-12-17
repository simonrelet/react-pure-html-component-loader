'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;

function defaultImport(node) {
  let res = result.empty();

  if (!node.attrs[importAttrs.PATH]) {
    res = result.withError(
      `A component import must have the attribute '${importAttrs.PATH}'`,
      node.meta.line
    );
  }

  if (node.children.length === 0 && !node.attrs[importAttrs.ALIAS]) {
    res = res.concat(result.withError(
      `A component default import must have the attribute '${importAttrs.ALIAS}'`,
      node.meta.line
    ));
  }

  return res;
}

function namedImport(node) {
  if (!node.attrs[importAttrs.ALIAS]) {
    return result.withError(
      `A component named import must have the attribute '${importAttrs.ALIAS}'`,
      node.meta.line
    );
  }

  if (node.attrs[importAttrs.ALIAS] === node.attrs[importAttrs.NAMED]) {
    return result.withWarning(
      `The '${importAttrs.NAMED}' attribute of a component named import should`
      + ` be omitted if it is the same as the '${importAttrs.ALIAS}' attribute`,
      node.meta.line
    );
  }

  return result.empty();
}

function importAttributes(node) {
  const childrenResult = node.children
    .map(namedImport)
    .reduce(result.reducer, result.empty());

  return defaultImport(node).concat(childrenResult);
}

function importsAttributes(ast) {
  return ast
    .filter(node => (
      node.name === constants.tags.IMPORT
        && node.attrs[importAttrs.TYPE] === importAttrs.types.COMPONENT
    ))
    .map(importAttributes)
    .reduce(result.reducer, result.empty());
}

module.exports = importsAttributes;
