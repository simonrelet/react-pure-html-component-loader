/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const importsNesting = require('./style-imports-nesting');
const result = require('../result');

module.exports = function() {
  describe('style-imports-nesting', function() {
    it('should accept absence of child', function() {
      const ast = [{ name: 'link', attrs: { rel: 'stylesheet' }, children: [] }];
      const res = importsNesting(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should reject any children elements', function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'stylesheet' },
        children: [
          { name: 'div', children: [], meta: {} },
          { name: 'div', children: [], meta: {} }
        ],
        meta: {}
      }];
      const res = importsNesting(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
