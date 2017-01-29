'use strict';

const constants = require('../../constants');
const result = require('../result');

const importAttrs = constants.attributes.import;
const componentAttrs = constants.attributes.components;

function createReducer(attrName) {
  return (acc, node) => {
    const id = node.attrs[attrName];
    if (id) {
      if (acc.ids[id]) {
        return {
          ids: acc.ids,
          result: acc.result.concat(result.withError(
            `id ${id} is already defined`,
            node.meta.line
          ))
        };
      }

      return {
        ids: Object.assign({}, acc.ids, { [id]: true }),
        result: acc.result
      };
    }

    return acc;
  };
}

function extractComponentId(acc, node) {
  return createReducer(componentAttrs.ID)(acc, node);
}

function extractImportIds(acc, node) {
  const reducer = createReducer(importAttrs.ALIAS);
  return node.children.reduce(reducer, reducer(acc, node));
}

function extractIds(acc, node) {
  if (node.name === constants.tags.COMPONENT) {
    return extractComponentId(acc, node);
  }
  return extractImportIds(acc, node);
}

function uniqueIds(ast) {
  return ast
    .filter(node => (
      node.name === constants.tags.COMPONENT
        || (node.name === constants.tags.IMPORT
          && node.attrs[importAttrs.TYPE] === importAttrs.types.COMPONENT)
    ))
    .reduce(extractIds, { ids: {}, result: result.empty() })
    .result;
}

module.exports = uniqueIds;
