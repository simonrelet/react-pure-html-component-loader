'use strict';

const camelCase = require('change-case').camelCase;

const constants = require('../constants');

const importAttrs = constants.attributes.import;

function normalizeImports(importNode) {
  const res = { path: importNode.attrs[importAttrs.PATH] };

  if (importNode.attrs[importAttrs.ALIAS]) {
    res.default = {
      tagName: importNode.attrs[importAttrs.ALIAS],
      varName: camelCase(importNode.attrs[importAttrs.ALIAS])
    };
  }

  if (importNode.children.length > 0) {
    res.named = importNode.children.map(child => ({
      tagName: child.attrs[importAttrs.ALIAS],
      varName: camelCase(child.attrs[importAttrs.ALIAS]),
      from: child.attrs[importAttrs.NAMED].replace(
        constants.attributes.bindings.STRICT_PATTERN,
        '$1'
      )
    }));
  }

  return res;
}

function tagToVar(imports) {
  const reducer = (map, i) => {
    if (i.default) {
      map[i.default.tagName] = i.default.varName;
    }

    if (i.named) {
      i.named.forEach(n => {
        map[n.tagName] = n.varName;
      });
    }

    return map;
  };

  return imports.reduce(reducer, {});
}

function renderImports(imports) {
  const mapper = i => {
    let varName = '';
    if (i.default) {
      varName = i.default.varName;
    }

    let namedImports = '';
    if (i.named) {
      const named = i.named.map(n => `${n.from} as ${n.varName}`);
      namedImports = `{ ${named.join(', ')} }`;
    }

    let sep = '';
    if (varName && namedImports) {
      sep = ', ';
    }

    return `import ${varName}${sep}${namedImports} from '${i.path}';`;
  };

  return imports.map(mapper).reduce((a, b) => `${a}${b}\n`, '');
}

function extractImports(roots) {
  const imports = roots
    .filter(node => node.name === constants.tags.IMPORT)
    .map(normalizeImports);

  return {
    tagToVar: tagToVar(imports),
    rendered: renderImports(imports)
  };
}

module.exports = extractImports;
