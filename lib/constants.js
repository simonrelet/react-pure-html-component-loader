'use strict';

module.exports = {
  tags: {
    IMPORT: 'import',
    TEMPLATE: 'template',
    LOOPS: 'repeat',
    CONDITIONALS: 'render'
  },

  attributes: {
    import: {
      PATH: 'path',
      NAMED: 'name',
      ALIAS: 'as'
    },

    loops: {
      ARRAY: 'for-each',
      VAR_NAME: 'as'
    },

    conditionals: {
      TEST: 'if'
    },

    bindings: {
      PATTERN: /{{\s+([^{}]*)\s+}}/g,
      STRICT_PATTERN: /^\s*{{\s*([^{}]*)\s*}}\s*$/,
      BOLLEAN_PATTERN: /^\s*(true|false)\s*$/i
    }
  }
};
