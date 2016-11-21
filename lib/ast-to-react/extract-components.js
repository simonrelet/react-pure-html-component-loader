'use strict';

const pascalCase = require('change-case').pascalCase;

const constants = require('../constants');
const componentsAttrs = constants.attributes.components;

function tagToVar(components) {
  const reducer = (map, t) => {
    const id = t.attrs[componentsAttrs.ID];
    if (id) {
      map[id] = pascalCase(id);
    }

    return map;
  };

  return components.reduce(reducer, {});
}

function getNamedNodes(components) {
  return components.filter(t => (
    t.attrs[componentsAttrs.ID]
    && !t.attrs.hasOwnProperty(componentsAttrs.DEFAULT))
  );
}

function getDefaultNode(templates) {
  return templates.filter(t => t.attrs.hasOwnProperty(componentsAttrs.DEFAULT))[0];
}

function extractComponents(roots) {
  const components = roots.filter(node => node.name === constants.tags.COMPONENT);

  return {
    tagToVar: tagToVar(components),
    namedNodes: getNamedNodes(components),
    defaultNode: getDefaultNode(components)
  };
}

module.exports = extractComponents;
