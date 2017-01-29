/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const uniqueIds = require('./unique-ids');
const result = require('../result');

module.exports = function() {
  describe('unique-ids', function() {
    it('should accept unique ids of <template>', function() {
      const ast = [
        { name: 'template', attrs: { id: 'some-id-1' } },
        { name: 'template', attrs: { id: 'some-id-2' } },
        { name: 'template', attrs: { id: 'some-id-3' } }
      ];
      const res = uniqueIds(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should accept unique ids of <link rel="import">', function() {
      const ast = [
        { name: 'link', attrs: { rel: 'import', id: 'some-id-1' }, children: [] },
        { name: 'link', attrs: { rel: 'import', id: 'some-id-2' }, children: [] },
        { name: 'link', attrs: { rel: 'import', id: 'some-id-3' }, children: [] }
      ];
      const res = uniqueIds(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should accept unique ids of <link rel="import"> and <template>', function() {
      const ast = [
        { name: 'link', attrs: { rel: 'import', id: 'some-id-1' }, children: [] },
        { name: 'link', attrs: { rel: 'import', id: 'some-id-2' }, children: [] },
        { name: 'link', attrs: { rel: 'import', id: 'some-id-3' }, children: [] },
        { name: 'template', attrs: { id: 'some-id-4' } },
        { name: 'template', attrs: { id: 'some-id-5' } }
      ];
      const res = uniqueIds(ast).build();

      expect(res).to.deep.equal(result.empty().build());
    });

    it('should reject identical ids for <template>', function() {
      const ast = [
        { name: 'template', attrs: { id: 'some-id' } },
        { name: 'template', attrs: { id: 'some-id' }, meta: {} }
      ];
      const res = uniqueIds(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it('should reject identical ids for <link rel="import">', function() {
      const ast = [
        {
          name: 'link',
          attrs: { rel: 'import', id: 'some-id' },
          children: []
        },
        {
          name: 'link',
          attrs: { rel: 'import', id: 'some-id' },
          children: [],
          meta: {}
        }
      ];
      const res = uniqueIds(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it('should reject identical ids for nested <link rel="import">', function() {
      const ast = [{
        name: 'link',
        attrs: { rel: 'import', id: 'some-id' },
        children: [
          { name: 'link', attrs: { id: 'some-id' }, meta: {} }
        ]
      }];
      const res = uniqueIds(ast).build();

      expect(res.errors.length).to.equal(1);
    });

    it('should reject identical ids of <link rel="import"> and <template>', function() {
      const ast = [
        {
          name: 'link',
          attrs: { rel: 'import' },
          children: [
            { name: 'link', attrs: { id: 'some-id' } }
          ]
        },
        { name: 'template', attrs: { id: 'some-id' }, meta: {} }
      ];
      const res = uniqueIds(ast).build();

      expect(res.errors.length).to.equal(1);
    });
  });
};
