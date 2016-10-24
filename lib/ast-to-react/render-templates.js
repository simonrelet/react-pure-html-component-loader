'use strict';

const constants = require('../constants');
const renderTemplate = require('./render-template');

const templatesAttrs = constants.attributes.templates;

function renderDefaultTemplate(node, tagToVar) {
  const id = node.attrs[templatesAttrs.ID];
  let varName = '';
  let sep = '';
  if (id) {
    varName = tagToVar[id];
    sep = ' ';
  }
  const content = renderTemplate(node, tagToVar);
  const component = `export default function${sep}${varName}(props) {\n${content}}\n`;
  let displayName = '';
  if (varName) {
    displayName = `${varName}.displayName = '${varName}';\n`;
  }
  return `${component}${displayName}`;
}

function renderNamedTemplate(node, tagToVar) {
  const varName = tagToVar[node.attrs[templatesAttrs.ID]];
  const content = renderTemplate(node, tagToVar);
  const component = `export function ${varName}(props) {\n${content}}\n`;
  const displayName = `${varName}.displayName = '${varName}';\n`;
  return `${component}${displayName}`;
}

function renderTemplates(options) {
  const renderedTemplates = options.namedNodes
    .map(node => renderNamedTemplate(node, options.tagToVar));

  if (options.defaultNode) {
    return renderedTemplates.concat([
      renderDefaultTemplate(options.defaultNode, options.tagToVar)
    ]);
  }

  return renderedTemplates;
}

module.exports = renderTemplates;
