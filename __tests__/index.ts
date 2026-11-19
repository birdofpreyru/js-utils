import { expect, it } from '@jest/globals';

import * as lib from '../build/index.js';

it('exports expected definitions', () => {
  expect(lib).toMatchSnapshot();
});
