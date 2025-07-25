import path from 'path';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v8.0.0/data-grid', () => {
  describe('reform row selection model', () => {
    it('transforms props as needed - js', () => {
      const actual = transform({ source: read('./actual.spec.js') }, { jscodeshift });

      const expected = read('./expected.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent - js', () => {
      const actual = transform({ source: read('./expected.spec.js') }, { jscodeshift });

      const expected = read('./expected.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('transforms props as needed - ts', () => {
      const actual = transform(
        { source: read('./ts-actual.spec.tsx') },
        { jscodeshift: jscodeshift.withParser('tsx') },
      );
      const expected = read('./ts-expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent - ts', () => {
      const actual = transform(
        { source: read('./ts-expected.spec.tsx') },
        { jscodeshift: jscodeshift.withParser('tsx') },
      );

      const expected = read('./ts-expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
