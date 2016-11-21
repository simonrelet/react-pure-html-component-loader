/* eslint no-unused-expressions: "off" */
'use strict';

const chai = require('chai');
const expect = chai.expect;

const extractComponents = require('./extract-components');

describe('extract-components', function() {
  it('should be empty if there is no nodes', function() {
    const res = extractComponents([]);

    expect(res).to.deep.equal({
      tagToVar: {},
      namedNodes: [],
      defaultNode: undefined
    });
  });

  it('should extract the default node', function() {
    const node = { name: 'template', attrs: { default: '' } };
    const res = extractComponents([ node ]);

    expect(res.defaultNode).to.deep.equal(node);
  });

  it('should set the id of the default node', function() {
    const node = {
      name: 'template',
      attrs: {
        default: '',
        id: 'default-component'
      }
    };
    const res = extractComponents([ node ]);

    expect(res).to.deep.equal({
      tagToVar: { 'default-component': 'DefaultComponent' },
      namedNodes: [],
      defaultNode: node
    });
  });

  it('should extract the named nodes', function() {
    const nodes = [
      { name: 'template', attrs: { id: 'named-one' } },
      { name: 'template', attrs: { id: 'named-two' } },
      { name: 'template', attrs: { id: 'named-three' } }
    ];
    const res = extractComponents(nodes);

    expect(res.namedNodes).to.deep.equal(nodes);
    expect(res.tagToVar).to.deep.equal({
      'named-one': 'NamedOne',
      'named-two': 'NamedTwo',
      'named-three': 'NamedThree'
    });
  });

  it('should ignore all other nodes', function() {
    const namedNode = { name: 'template', attrs: { id: 'named-component' } };
    const defaultNode = { name: 'template', attrs: { default: '' } };
    const nodes = [
      namedNode,
      defaultNode,
      { name: 'link', attrs: { href: 'href' } },
      { name: 'div', attrs: { class: 'some-class' } }
    ];
    const res = extractComponents(nodes);

    expect(res).to.deep.equal({
      tagToVar: { 'named-component': 'NamedComponent' },
      namedNodes: [ namedNode ],
      defaultNode
    });
  });
});
