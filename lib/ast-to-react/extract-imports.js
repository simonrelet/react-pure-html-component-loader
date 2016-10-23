'use strict';

const pascalCase = require('change-case').pascalCase;

const constants = require('../constants');

const importAttrs = constants.attributes.import;

function normalizeComponentImport(importNode) {
  const res = {
    type: importAttrs.types.COMPONENT,
    path: importNode.attrs[importAttrs.PATH]
  };

  if (importNode.attrs[importAttrs.ALIAS]) {
    res.default = {
      tagName: importNode.attrs[importAttrs.ALIAS],
      varName: pascalCase(importNode.attrs[importAttrs.ALIAS])
    };
  }

  if (importNode.children.length > 0) {
    res.named = importNode.children.map(child => ({
      tagName: child.attrs[importAttrs.ALIAS],
      varName: pascalCase(child.attrs[importAttrs.ALIAS]),
      from: child.attrs[importAttrs.NAMED]
        ? pascalCase(child.attrs[importAttrs.NAMED])
        : pascalCase(child.attrs[importAttrs.ALIAS])
    }));
  }

  return res;
}

function normalizeStylesheetImport(importNode) {
  const res = {
    type: importAttrs.types.STYLESHEET,
    path: importNode.attrs[importAttrs.PATH]
  };

  if (importNode.attrs[importAttrs.OBJECT_VALUE]) {
    res.value = importNode.attrs[importAttrs.OBJECT_VALUE].replace(
      constants.attributes.bindings.STRICT_PATTERN,
      (m, g1) => g1.trim()
    );
  }

  return res;
}

function normalizeImport(importNode) {
  const importType = importNode.attrs[importAttrs.TYPE];
  switch (importType) {
    case importAttrs.types.COMPONENT:
      return normalizeComponentImport(importNode);
    case importAttrs.types.STYLESHEET:
      return normalizeStylesheetImport(importNode);
    default:
      throw new Error(`Unknown import type: '${importType}'`);
  }
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

  return imports
    .filter(i => i.type === importAttrs.types.COMPONENT)
    .reduce(reducer, {});
}

function renderComponentImport(i) {
  let varName = '';
  if (i.default) {
    varName = i.default.varName;
  }

  let namedImports = '';
  if (i.named) {
    const named = i.named.map(n => {
      if (n.from === n.varName) {
        return n.varName;
      }
      return `${n.from} as ${n.varName}`;
    });
    namedImports = `{ ${named.join(', ')} }`;
  }

  let sep = '';
  if (varName && namedImports) {
    sep = ', ';
  }

  return `import ${varName}${sep}${namedImports} from '${i.path}';`;
}

function renderStylesheetImport(i) {
  let varName = '';
  if (i.value) {
    varName = ` ${i.value} from`;
  }
  return `import${varName} '${i.path}';`;
}

function renderImports(imports) {
  const mapper = i => {
    switch (i.type) {
      case importAttrs.types.COMPONENT:
        return renderComponentImport(i);
      case importAttrs.types.STYLESHEET:
        return renderStylesheetImport(i);
      default:
        throw new Error(`Unknown import type: '${i.type}'`);
    }
  };

  return imports.map(mapper).reduce((a, b) => `${a}${b}\n`, '');
}

function extractImports(roots) {
  const imports = roots
    .filter(node => node.name === constants.tags.IMPORT)
    .map(normalizeImport);

  return {
    tagToVar: tagToVar(imports),
    rendered: renderImports(imports)
  };
}

module.exports = extractImports;
