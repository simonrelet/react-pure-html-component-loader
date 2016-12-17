/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const importsAttributes = require('./style-imports-attributes');
const result = require('../result');

module.exports = function() {
  describe('style-imports-attributes', function() {
    it('should accept valid global import', function() {
      const ast = [{
        name: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'path/to/component'
        },
        children: []
      }];
      const res = importsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should accept valid named import', function() {
      const ast = [{
        name: 'link',
        attrs: {
          rel: 'stylesheet',
          href: 'path/to/component',
          id: 'wat'
        },
        children: []
      }];
      const res = importsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject missing a 'href' attribute`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'stylesheet' },
        children: [],
        meta: {}
      }];
      const res = importsAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
