import { withRetries } from '../../src';

it('works as expected in a basic scenario', async () => {
  let n = 1;
  const action = jest.fn(() => {
    if (n++ < 2) throw Error('fail');
    return 'success';
  });
  const res = await withRetries(action);
  expect(res).toBe('success');
  expect(action.mock.results).toEqual([{
    type: 'throw',
    value: Error('fail'),
  }, {
    type: 'return',
    value: 'success',
  }]);
});
