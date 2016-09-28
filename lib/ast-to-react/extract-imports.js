'use strict';

const camelCase = require('change-case').camelCase;

const constants = require('../constants');

function normalizeImports(importNode) {
  const res = { path: importNode.attrs.path };

  if (importNode.attrs.as) {
    res.default = {
      tagName: importNode.attrs.as,
      varName: camelCase(importNode.attrs.as)
    };
  }

  if (importNode.children.length > 0) {
    res.named = importNode.children.map(child => ({
      tagName: child.attrs.as,
      varName: camelCase(child.attrs.as),
      from: child.attrs.name
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
