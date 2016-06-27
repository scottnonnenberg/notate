import { expect } from 'chai';

import { default as merge, findFreeKey } from 'src/merge';


describe('unit/merge', () => {
  describe('#merge', () => {
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
        then2: 'new',
        end: 'FOUR',
      };

      merge(target, source);

      expect(target).to.deep.equal(expected);
    });
  });

  describe('#findFreeKey', () => {
    it('returns "key2" if first alternative works', () => {
      const key = 'key';
      const object = {};

      const actual = findFreeKey(key, object);
      expect(actual).to.equal('key2');
    });

    it('returns "key10" if all previous integers are taken', () => {
      const key = 'key';
      const object = {
        key2: '2',
        key3: '3',
        key4: '4',
        key5: '5',
        key6: '6',
        key7: '7',
        key8: '8',
        key9: '9',
      };

      const actual = findFreeKey(key, object);
      expect(actual).to.equal('key10');
    });
  });
});
