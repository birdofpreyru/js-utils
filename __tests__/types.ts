import { expect as t } from 'tstyche';

import type { Extends, Implements } from '../src/types';

test('Extends', () => {
  t<Extends<{ a: 'A'; b?: 'B' }, { a: 'A' }>>().type.toBe<{ a: 'A' }>();
  t<Extends<{ a: 'A'; b?: 'B' }, { a: 'A'; b: 'B' }>>().type.toBe<{ a: 'A'; b: 'B' }>();

  // @ts-expect-error Type '{ b: "B"; }' does not satisfy the constraint '{ a: "A"; b?: "B" | undefined; }'.
  t<Extends<{ a: 'A'; b?: 'B' }, { b: 'B' }>>().type.not.toRaiseError();
});

test('Implements', () => {
  // @ts-expect-error Type '{ a: "A"; }' does not satisfy the constraint 'Required<{ a: "A"; b?: "B" | undefined; }>'.
  t<Implements<{ a: 'A'; b?: 'B' }, { a: 'A' }>>().type.not.toRaiseError();

  t<Implements<{ a: 'A'; b?: 'B' }, { a: 'A'; b: 'B' }>>().type.toBe<{ a: 'A'; b: 'B' }>();

  // @ts-expect-error Type '{ b: "B"; }' does not satisfy the constraint 'Required<{ a: "A"; b?: "B" | undefined; }>'.
  t<Implements<{ a: 'A'; b?: 'B' }, { b: 'B' }>>().type.not.toRaiseError();
});
