'use strict';

module.exports = {
  tags: {
    IMPORT: 'import',
    TEMPLATE: 'template'
  },

  attributes: {
    import: {
      PATH: 'path',
      NAMED: 'name',
      ALIAS: 'as'
    },

    bindings: {
      PATTERN: /{{\s+(.*)\s+}}/,
      STRICT_PATTERN: /^\s*{{\s*(.*)\s*}}\s*$/
    }
  }
};
