import { expect, it } from '@jest/globals';

import * as lib from '../src';

it('exports expected definitions', () => {
  expect(lib).toMatchSnapshot();
});
