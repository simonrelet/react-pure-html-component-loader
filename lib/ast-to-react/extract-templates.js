'use strict';

const pascalCase = require('change-case').pascalCase;

const constants = require('../constants');

function tagToVar(templates) {
  const reducer = (map, t) => {
    if (t.attrs.name) {
      map[t.attrs.name] = pascalCase(t.attrs.name);
    }

    return map;
  };

  return templates.reduce(reducer, {});
}

function getNamedNodes(templates) {
  return templates.filter(t => t.attrs.name);
}

function getDefaultNode(templates) {
  return templates.filter(t => !t.attrs.name)[0];
}

function extractTemplates(roots) {
  const templates = roots.filter(node => node.name === constants.tags.TEMPLATE);

  return {
    tagToVar: tagToVar(templates),
    namedNodes: getNamedNodes(templates),
    defaultNode: getDefaultNode(templates)
  };
}

module.exports = extractTemplates;
