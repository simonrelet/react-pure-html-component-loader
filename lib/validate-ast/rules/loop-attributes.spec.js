/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const loopAttributes = require('./loop-attributes');
const result = require('../result');

module.exports = function() {
  describe('loop-attributes', function() {
    it(`should accept '<render for-each="hello" as="wat">'`, function() {
      const ast = [{
        name: 'render',
        attrs: { 'for-each': 'hello', 'as': 'wat' },
        children: []
      }];
      const res = loopAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should reject missing attribute 'as' in '<render>'`, function() {
      const ast = [{
        name: 'render',
        attrs: { 'for-each': '' },
        children: [],
        meta: {}
      }];
      const res = loopAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
