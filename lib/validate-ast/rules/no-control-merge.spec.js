'use strict';

const chai = require('chai');
const expect = chai.expect;

const noControlMerge = require('./no-control-merge');
const result = require('../result');

module.exports = function() {
  describe('no-control-merge', function() {
    it(`should reject '<render for-each if>'`, function() {
      const ast = [{
        name: 'render',
        attrs: { 'for-each': '', 'if': '' },
        meta: {},
        children: []
      }];
      const res = noControlMerge(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it(`should accept a <render for-each>`, function() {
      const ast = [{
        name: 'render',
        attrs: { 'for-each': '' },
        children: []
      }];
      const res = noControlMerge(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should accept a <render if>`, function() {
      const ast = [{
        name: 'render',
        attrs: { if: '' },
        children: []
      }];
      const res = noControlMerge(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it(`should accept nested controls`, function() {
      const ast = [{
        name: 'render',
        attrs: { if: '' },
        children: [
          { name: 'render', attrs: { 'for-each': '' }, children: [] }
        ]
      }];
      const res = noControlMerge(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });
  });
};
