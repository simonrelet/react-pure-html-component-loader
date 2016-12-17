'use strict';

const constants = require('../../constants');
const result = require('../result');

const componentAttrs = constants.attributes.components;

function componentAttributes(node) {
  if (node.attrs[componentAttrs.ID]) {
    return result.empty();
  }

  if (node.attrs.hasOwnProperty(componentAttrs.DEFAULT)) {
    return result.withWarning(
      `Concider adding an attribute '${componentAttrs.ID}' to a default`
      + ` component for debug purposes`,
      node.meta.line
    );
  }

  return result.withError(
    `A named component must have an attribute '${componentAttrs.ID}' to be used`,
    node.meta.line
  );
}

module.exports = function(ast) {
  return ast
    .filter(node => node.name === constants.tags.COMPONENT)
    .map(componentAttributes)
    .reduce(result.reducer, result.empty());
};
