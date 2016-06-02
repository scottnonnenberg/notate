import { expect } from 'chai';

import merge from 'src/merge';


describe('unit/merge', () => {
  it('handles null source', () => {
    const target = {};
    const source = null;
    merge(target, source);
  });

  it('handles null target', () => {
    const target = null;
    const source = {};
    merge(target, source);
  });

  it('merges source into target', () => {
    const target = {
      start: 1,
      next: '2',
    };
    const source = {
      then: 'three',
      end: 'FOUR',
    };
    const expected = {
      start: 1,
      next: '2',
      then: 'three',
      end: 'FOUR',
    };

    merge(target, source);

    expect(target).to.deep.equal(expected);
  });

  it('does not copy over existing values', () => {
    const target = {
      start: 1,
      next: '2',
      then: 'existing',
    };
    const source = {
      then: 'new',
      end: 'FOUR',
    };
    const expected = {
      start: 1,
      next: '2',
      then: 'existing',
      end: 'FOUR',
    };

    merge(target, source);

    expect(target).to.deep.equal(expected);
  });
});
