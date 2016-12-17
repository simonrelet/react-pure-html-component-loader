'use strict';

const chai = require('chai');
const expect = chai.expect;

const componentsAttributes = require('./components-attributes');
const result = require('../result');

module.exports = function() {
  describe('components-attributes', function() {
    it(`should accept '<template default id="wat">'`, function() {
      const ast = [{
        name: 'template',
        attrs: { default: true, id: 'wat' },
        children: []
      }];
      const res = componentsAttributes(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should warn about missing attribute 'id' in '<template default>'`, function() {
      const ast = [{
        name: 'template',
        attrs: { default: true },
        children: [],
        meta: {}
      }];
      const res = componentsAttributes(ast).build();

      expect(res.warnings.length).to.equal(1);
    });

    it(`should reject missing attribute 'id' in '<template>'`, function() {
      const ast = [{
        name: 'template',
        attrs: {},
        children: [],
        meta: {}
      }];
      const res = componentsAttributes(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
