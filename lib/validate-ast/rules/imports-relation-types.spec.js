'use strict';

const chai = require('chai');
const expect = chai.expect;

const constants = require('../../constants');
const importsRelationTypes = require('./imports-relation-types');
const result = require('../result');

const importAttrs = constants.attributes.import;
const types = Object.keys(importAttrs.types)
  .map(k => importAttrs.types[k]);

module.exports = function() {
  describe('imports-relation-types', function() {
    types.forEach(type => {
      it(`should accept '<link rel="${type}">'`, function() {
        const ast = [{
          name: 'link',
          attrs: { rel: type }
        }];
        const res = importsRelationTypes(ast).build();

        expect(res).to.deep.equal(result.empty().build());
      });
    });

    it(`should reject '<link>'`, function() {
      const ast = [{
        name: 'link',
        attrs: {},
        meta: {}
      }];
      const res = importsRelationTypes(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should reject unknown type '<link rel="hello">'`, function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'hello' },
        meta: {}
      }];
      const res = importsRelationTypes(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
