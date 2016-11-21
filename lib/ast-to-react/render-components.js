'use strict';

const constants = require('../constants');
const renderComponent = require('./render-component');

const componentsAttrs = constants.attributes.components;

function renderDefaultComponent(node, tagToVar) {
  const id = node.attrs[componentsAttrs.ID];
  let varName = '';
  let sep = '';
  if (id) {
    varName = tagToVar[id];
    sep = ' ';
  }
  const content = renderComponent(node, tagToVar);
  const component = `export default function${sep}${varName}(props) {\n${content}}\n`;
  let displayName = '';
  if (varName) {
    displayName = `${varName}.displayName = '${varName}';\n`;
  }
  return `${component}${displayName}`;
}

function renderNamedComponent(node, tagToVar) {
  const varName = tagToVar[node.attrs[componentsAttrs.ID]];
  const content = renderComponent(node, tagToVar);
  const component = `export function ${varName}(props) {\n${content}}\n`;
  const displayName = `${varName}.displayName = '${varName}';\n`;
  return `${component}${displayName}`;
}

function renderComponents(options) {
  const renderedComponents = options.namedNodes
    .map(node => renderNamedComponent(node, options.tagToVar));

  if (options.defaultNode) {
    return renderedComponents.concat([
      renderDefaultComponent(options.defaultNode, options.tagToVar)
    ]);
  }

  return renderedComponents;
}

module.exports = renderComponents;
