'use strict';

const constants = require('../../constants');
const result = require('../result');

const templateAttrs = constants.attributes.templates;

function onlyDefault(node) {
  return node.name === constants.tags.TEMPLATE
    && node.attrs.hasOwnProperty(templateAttrs.DEFAULT);
}

module.exports = function(ast) {
  const defaultTemplates = ast.filter(onlyDefault);

  if (defaultTemplates.length > 1) {
    const mapper = node => result.withError(
      `Only one default template is allowed`,
      node.meta.line
    );

    return defaultTemplates
      .map(mapper)
      .reduce(result.reducer, result.empty());
  }

  return result.empty();
};
