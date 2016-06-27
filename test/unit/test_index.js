/* eslint-disable import/no-commonjs */

import { expect } from 'chai';

const index = require('src/index');


describe('unit/index', () => {
  it('is a function', () => {
    expect(index).to.be.a('function');
  });

  it('has a notate key which is a function', () => {
    expect(index).to.have.a.property('notate')
      .that.is.a('function');
  });

  it('has a prettyPrint key which is a function', () => {
    expect(index).to.have.a.property('prettyPrint')
      .that.is.a('function');
  });

  it('has a justNotate key which is a function', () => {
    expect(index).to.have.a.property('justNotate')
      .that.is.a('function');
  });
});
