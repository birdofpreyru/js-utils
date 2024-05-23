import * as lib from '../src';

it('exports expected definitions', () => {
  expect(lib).toMatchSnapshot();
});
