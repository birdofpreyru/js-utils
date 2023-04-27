import * as lib from '../../js';

it('exports expected definitions', () => {
  expect(lib).toMatchSnapshot();
});
