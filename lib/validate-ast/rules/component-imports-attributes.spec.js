/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const importsAttributes = require('./component-imports-attributes');
const result = require('../result');

module.exports = function() {
  describe('component-imports-attributes', function() {
    it('should accept valid default import', function() {
      const ast = [{
        name: 'link',
        attrs: {
          rel: 'import',
          href: 'path/to/component',
          id: 'wat'
        },
        children: []
      }];
      const res = importsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should accept valid named import', function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', href: 'path/to/component' },
        children: [{
          name: 'link',
          attrs: { rel: 'import', id: 'wat' },
          children: []
        }]
      }];
      const res = importsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should accept valid default and named import', function() {
      const ast = [{
        name: 'link',
        attrs: {
          rel: 'import',
          href: 'path/to/component',
          id: 'wat'
        },
        children: [{
          name: 'link',
          attrs: { rel: 'import', id: 'wat' },
          children: []
        }]
      }];
      const res = importsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should warn about identical 'name' and 'id' attributes for name import`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', href: 'path/to/component' },
        children: [{
          name: 'link',
          attrs: {
            rel: 'import',
            id: 'wat',
            name: 'wat'
          },
          children: [],
          meta: {}
        }]
      }];
      const res = importsAttributes(ast).build();

      expect(res.warnings.length).to.equal(1);
    });

    it(`should accept different 'name' and 'id' attributes for name import`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', href: 'path/to/component' },
        children: [{
          name: 'link',
          attrs: {
            rel: 'import',
            id: 'wat',
            name: 'yop'
          },
          meta: {}
        }]
      }];
      const res = importsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject missing an 'id' attribute for default import`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', href: 'path/to/component' },
        children: [],
        meta: {}
      }];
      const res = importsAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should reject missing an 'id' attribute for named import`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', href: 'path/to/component' },
        children: [{
          name: 'link',
          attrs: { rel: 'import' },
          meta: {}
        }]
      }];
      const res = importsAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should reject missing a 'href' attribute for default import`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', id: 'wat' },
        children: [],
        meta: {}
      }];
      const res = importsAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should reject missing a 'href' attribute for named import`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import' },
        children: [{
          name: 'link',
          attrs: { rel: 'import', id: 'wat' }
        }],
        meta: {}
      }];
      const res = importsAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
