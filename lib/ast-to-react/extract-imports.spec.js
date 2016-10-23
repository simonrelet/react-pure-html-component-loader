/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const extractImports = require('./extract-imports');

describe('extract-imports', function() {
  it('should be empty if there is no nodes', function() {
    const res = extractImports([]);
    expect(res).to.deep.equal({ tagToVar: {}, rendered: '' });
  });

  describe('for template imports', function() {
    it('should extract a single import', function() {
      const node = {
        name: 'link',
        attrs: { href: 'href', id: 'id-link', rel: 'import' },
        children: []
      };
      const res = extractImports([ node ]);

      expect(res).to.deep.equal({
        tagToVar: { 'id-link': 'IdLink' },
        rendered: `import IdLink from 'href';\n`
      });
    });

    it('should extract multiple imports', function() {
      const nodes = [
        {
          name: 'link',
          attrs: { href: 'href/one', id: 'id-link-one', rel: 'import' },
          children: []
        },
        {
          name: 'link',
          attrs: { href: 'href/two', id: 'id-link-two', rel: 'import' },
          children: []
        }
      ];
      const res = extractImports(nodes);
      const rendered = [
        `import IdLinkOne from 'href/one';\n`,
        `import IdLinkTwo from 'href/two';\n`
      ];

      expect(res).to.deep.equal({
        tagToVar: {
          'id-link-one': 'IdLinkOne',
          'id-link-two': 'IdLinkTwo'
        },
        rendered: rendered.join('')
      });
    });

    it('should extract a named import', function() {
      const node = {
        name: 'link',
        attrs: { href: 'href', rel: 'import' },
        children: [{
          name: 'link',
          attrs: { id: 'id-link', rel: 'import' }
        }]
      };
      const res = extractImports([ node ]);

      expect(res).to.deep.equal({
        tagToVar: { 'id-link': 'IdLink' },
        rendered: `import { IdLink } from 'href';\n`
      });
    });

    it('should extract a named import with alias', function() {
      const node = {
        name: 'link',
        attrs: { href: 'href', rel: 'import' },
        children: [{
          name: 'link',
          attrs: { id: 'id-link-alias', name: 'id-link', rel: 'import' }
        }]
      };
      const res = extractImports([ node ]);

      expect(res).to.deep.equal({
        tagToVar: { 'id-link-alias': 'IdLinkAlias' },
        rendered: `import { IdLink as IdLinkAlias } from 'href';\n`
      });
    });

    it('should extract a nested imports', function() {
      const node = {
        name: 'link',
        attrs: { href: 'href', id: 'id-link', rel: 'import' },
        children: [{
          name: 'link',
          attrs: { id: 'id-link-named', rel: 'import' }
        }]
      };
      const res = extractImports([ node ]);

      expect(res).to.deep.equal({
        tagToVar: {
          'id-link': 'IdLink',
          'id-link-named': 'IdLinkNamed'
        },
        rendered: `import IdLink, { IdLinkNamed } from 'href';\n`
      });
    });
  });

  describe('for style imports', function() {
    it('should extract global import', function() {
      const node = {
        name: 'link',
        attrs: { href: 'href', rel: 'stylesheet' }
      };
      const res = extractImports([ node ]);

      expect(res).to.deep.equal({
        tagToVar: {},
        rendered: `import 'href';\n`
      });
    });

    it('should extract named import', function() {
      const node = {
        name: 'link',
        attrs: { href: 'href', id: '{{ style }}', rel: 'stylesheet' }
      };
      const res = extractImports([ node ]);

      expect(res).to.deep.equal({
        tagToVar: {},
        rendered: `import style from 'href';\n`
      });
    });
  });
});
