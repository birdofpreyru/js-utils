import * as lib from '../ts';

it('exports expected definitions', () => {
  expect(lib).toMatchSnapshot();
});
