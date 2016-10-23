'use strict';

const pascalCase = require('change-case').pascalCase;

const constants = require('../constants');
const templateAttrs = constants.attributes.templates;

function tagToVar(templates) {
  const reducer = (map, t) => {
    const id = t.attrs[templateAttrs.ID];
    if (id) {
      map[id] = pascalCase(id);
    }

    return map;
  };

  return templates.reduce(reducer, {});
}

function getNamedNodes(templates) {
  return templates.filter(t => (
    t.attrs[templateAttrs.ID]
    && !t.attrs.hasOwnProperty(templateAttrs.DEFAULT))
  );
}

function getDefaultNode(templates) {
  return templates.filter(t => t.attrs.hasOwnProperty(templateAttrs.DEFAULT))[0];
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
