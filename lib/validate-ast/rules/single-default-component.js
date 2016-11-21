'use strict';

const constants = require('../../constants');
const result = require('../result');

const componentsAttrs = constants.attributes.components;

function onlyDefault(node) {
  return node.name === constants.tags.COMPONENT
    && node.attrs.hasOwnProperty(componentsAttrs.DEFAULT);
}

module.exports = function(ast) {
  const defaultComponents = ast.filter(onlyDefault);

  if (defaultComponents.length > 1) {
    const mapper = node => result.withError(
      `Only one default component is allowed`,
      node.meta.line
    );

    return defaultComponents
      .map(mapper)
      .reduce(result.reducer, result.empty());
  }

  return result.empty();
};
