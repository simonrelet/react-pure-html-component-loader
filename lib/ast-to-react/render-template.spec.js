/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const renderTemplate = require('./render-template');

describe('render-template', function() {
  describe('renderJsxText', function() {
    it('should render simple text', function() {
      const node = { value: 'Hello World' };
      const res = renderTemplate.renderJsxText(node, '');
      expect(res).to.equal('Hello World\n');
    });

    it('should use the given indent', function() {
      const node = { value: 'text' };
      const res = renderTemplate.renderJsxText(node, '   ');
      expect(res).to.equal('   text\n');
    });

    it('should replace a simple binding', function() {
      const node = { value: '{{ text }}' };
      const res = renderTemplate.renderJsxText(node, '');
      expect(res).to.equal('{ text }\n');
    });

    it('should replace a multiple bindings', function() {
      const node = { value: '{{ text }}   {{ value }}' };
      const res = renderTemplate.renderJsxText(node, '');
      expect(res).to.equal('{ text }   { value }\n');
    });

    it('should keep original spaces', function() {
      const node = { value: '    {{ text }}   {{ value }}  ' };
      const res = renderTemplate.renderJsxText(node, '');
      expect(res).to.equal('    { text }   { value }  \n');
    });

    it('should trim binding spaces', function() {
      const node = { value: '{{     text   }}{{value   }}' };
      const res = renderTemplate.renderJsxText(node, '');
      expect(res).to.equal('{ text }{ value }\n');
    });
  });

  describe('renderJsxPropsSpreading', function() {
    it('should render binding', function() {
      const res = renderTemplate.renderJsxPropsSpreading('{{ value }}');
      expect(res).to.equal('{ ...value }');
    });

    it('should ignore spaces', function() {
      const res = renderTemplate.renderJsxPropsSpreading('    {{    value   }}  ');
      expect(res).to.equal('{ ...value }');
    });
  });

  describe('renderJsxProp', function() {
    it('should consider empty as `true`', function() {
      const res = renderTemplate.renderJsxProp('', 'name');
      expect(res).to.equal('name={ true }');
    });

    [ 'true', 'false', 'TRUE', 'FALSE' ].forEach(test => {
      it(`should consider '${test}' as boolean`, function() {
        const res = renderTemplate.renderJsxProp(test, 'name');
        expect(res).to.equal(`name={ ${test.toLowerCase()} }`);
      });
    });

    it('should render a strict binding', function() {
      const res = renderTemplate.renderJsxProp('{{ value }}', 'name');
      expect(res).to.equal('name={ value }');
    });

    it('should ignore strict binding spaces', function() {
      const res = renderTemplate.renderJsxProp('  {{   value}}  ', 'name');
      expect(res).to.equal('name={ value }');
    });

    it('should render a binding', function() {
      const res = renderTemplate.renderJsxProp('hello {{ name }}!', 'name');
      expect(res).to.equal('name={ `hello ${ name }!` }');
    });

    it('should ignore spaces in a binding', function() {
      const res = renderTemplate.renderJsxProp('   hello {{name    }}!', 'name');
      expect(res).to.equal('name={ `   hello ${ name }!` }');
    });
  });

  describe('renderJsxProps', function() {
    it('should render simple attribute', function() {
      const node = { attrs: { name: 'value' } };
      const res = renderTemplate.renderJsxProps(node);
      expect(res).to.equal(` name='value'`);
    });

    it(`should convert the attribute 'for'`, function() {
      const node = { attrs: { for: 'value' } };
      const res = renderTemplate.renderJsxProps(node);
      expect(res).to.equal(` htmlFor='value'`);
    });

    it(`should convert the attribute 'class'`, function() {
      const node = { attrs: { class: 'value' } };
      const res = renderTemplate.renderJsxProps(node);
      expect(res).to.equal(` className='value'`);
    });

    it('should render attribute spreading', function() {
      const node = { attrs: { 'use-props': '{{ value }}' } };
      const res = renderTemplate.renderJsxProps(node);
      expect(res).to.equal(` { ...value }`);
    });

    it('should render bindings', function() {
      const node = { attrs: { name: 'hello {{ name }}!' } };
      const res = renderTemplate.renderJsxProps(node);
      expect(res).to.equal(' name={ `hello ${ name }!` }');
    });

    it('should render multiple attributes', function() {
      const node = {
        attrs: {
          name: 'value',
          toto: '{{ tata }}'
        }
      };
      const res = renderTemplate.renderJsxProps(node);
      expect(res).to.equal(` name='value' toto={ tata }`);
    });
  });

  describe('renderJsxBasicTag', function() {
    it('should render a simple self closing tag', function() {
      const node = { name: 'name', attrs: {}, children: [] };
      const res = renderTemplate.renderJsxBasicTag(node, {}, '');
      expect(res).to.equal('<name />\n');
    });

    it('should render a self closing tag with attributes', function() {
      const attrs = { toto: 'tata', plop: 'blop' };
      const node = { name: 'name', attrs, children: [] };
      const res = renderTemplate.renderJsxBasicTag(node, {}, '');
      expect(res).to.equal(`<name toto='tata' plop='blop' />\n`);
    });

    it('should render a tag with children', function() {
      const children = [{
        type: 'tag',
        name: 'child',
        attrs: {},
        children: []
      }];
      const node = { name: 'name', attrs: {}, children };
      const res = renderTemplate.renderJsxBasicTag(node, {}, '');
      expect(res).to.equal(`<name>\n  <child />\n</name>\n`);
    });

    it('should convert the tag name', function() {
      const node = { name: 'name-to-convert', attrs: {}, children: [] };
      const tagToVar = { 'name-to-convert': 'nameToConvert' };
      const res = renderTemplate.renderJsxBasicTag(node, tagToVar, '');
      expect(res).to.equal(`<nameToConvert />\n`);
    });

    it('should use the given indent', function() {
      const node = { name: 'name', attrs: {}, children: [] };
      const res = renderTemplate.renderJsxBasicTag(node, {}, '  ');
      expect(res).to.equal(`  <name />\n`);
    });
  });

  describe('renderJsxConditionalTag', function() {
    const children = [{
      type: 'tag',
      name: 'name',
      attrs: {},
      children: []
    }];

    it('should render a simple conditional', function() {
      const node = { attrs: { if: '{{ test }}' }, children };
      const res = renderTemplate.renderJsxConditionalTag(node, {}, '');
      expect(res).to.equal('{ (test) && (\n  <name />\n) }\n');
    });

    it('should ignore spaces in binding', function() {
      const node = { attrs: { if: '   {{ test    }}' }, children };
      const res = renderTemplate.renderJsxConditionalTag(node, {}, '');
      expect(res).to.equal('{ (test) && (\n  <name />\n) }\n');
    });

    it('should render composed conditionals', function() {
      const node = { attrs: { if: '{{ test && plop || toto }}' }, children };
      const res = renderTemplate.renderJsxConditionalTag(node, {}, '');
      expect(res).to.equal('{ (test && plop || toto) && (\n  <name />\n) }\n');
    });

    it('should use the given indent', function() {
      const node = { attrs: { if: '{{ test }}' }, children };
      const res = renderTemplate.renderJsxConditionalTag(node, {}, '  ');
      expect(res).to.equal('  { (test) && (\n    <name />\n  ) }\n');
    });
  });

  describe('renderJsxLoopTag', function() {
    const children = [{
      type: 'tag',
      name: 'name',
      attrs: {},
      children: []
    }];

    it('should render a simple loop', function() {
      const attrs = { 'for-each': '{{ array }}', 'as': '{{ item }}' };
      const node = { attrs, children };
      const res = renderTemplate.renderJsxLoopTag(node, {}, '');
      expect(res).to.equal('{ array.map(item => (\n  <name />\n)) }\n');
    });

    it('should ignore spaces in binding', function() {
      const attrs = { 'for-each': '  {{  array}}', 'as': '{{item   }}  ' };
      const node = { attrs, children };
      const res = renderTemplate.renderJsxLoopTag(node, {}, '');
      expect(res).to.equal('{ array.map(item => (\n  <name />\n)) }\n');
    });

    it('should use the given indent', function() {
      const attrs = { 'for-each': '  {{  array}}', 'as': '{{item   }}  ' };
      const node = { attrs, children };
      const res = renderTemplate.renderJsxLoopTag(node, {}, '  ');
      expect(res).to.equal('  { array.map(item => (\n    <name />\n  )) }\n');
    });
  });
});
