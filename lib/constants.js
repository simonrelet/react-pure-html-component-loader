'use strict';

module.exports = {
  tags: {
    IMPORT: 'import',
    TEMPLATE: 'template',
    LOOPS: 'repeat'
  },

  attributes: {
    import: {
      PATH: 'path',
      NAMED: 'name',
      ALIAS: 'as'
    },

    loops: {
      TEMPLATE_NAME: 'template',
      ARRAY: 'for-each',
      KEY: 'key'
    },

    bindings: {
      PATTERN: /{{\s+([^{}]*)\s+}}/g,
      STRICT_PATTERN: /^\s*{{\s*([^{}]*)\s*}}\s*$/,
      BOLLEAN_PATTERN: /^\s*(true|false)\s*$/i
    }
  }
};
