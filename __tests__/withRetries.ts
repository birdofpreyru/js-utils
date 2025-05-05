import { expect as of } from 'tstyche';

import type * as SrcNS from '../src';
import type * as TimeNS from '../src/time';

const mockTimer = jest.fn(async () => Promise.resolve());

jest.mock<typeof TimeNS>('../src/time', () => ({
  timer: mockTimer,
} as unknown as typeof TimeNS));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { timer, withRetries }: typeof SrcNS = require('../src') as typeof SrcNS;

jest.useFakeTimers();

const FAILURE = 'FAILURE';
const SUCCESS = 'SUCCESS';

function newAsyncTestAction(numFailures = 0) {
  let counter = 0;
  return jest.fn(async () => {
    await timer(100);
    if (counter++ < numFailures) throw Error(FAILURE);
    return SUCCESS;
  });
}

function newSyncTestAction(numFailures: number) {
  let counter = 0;
  return jest.fn(() => {
    if (counter++ < numFailures) throw Error(FAILURE);
    return SUCCESS;
  });
}

it('works as expected in a basic scenario', async () => {
  let n = 1;
  const action = jest.fn(() => {
    // TODO: Revise.
    // eslint-disable-next-line jest/no-conditional-in-test
    if (n++ < 2) throw Error('fail');
    return 'success';
  });
  const res = await withRetries(action);
  expect(res).toBe('success');

  // TODO: Revise later - as done now, it does not strict equal, but it works
  // correctly.
  // eslint-disable-next-line jest/prefer-strict-equal
  expect(action.mock.results).toEqual([{
    type: 'throw',
    value: Error('fail'),
  }, {
    type: 'return',
    value: 'success',
  }]);
});

it('works correctly with async actions', async () => {
  for (let i = 0; i < 2; ++i) {
    mockTimer.mockClear();
    const action = newAsyncTestAction(i);

    const promise = withRetries(action);
    of(promise).type.toBe<Promise<string>>();
    await expect(promise).resolves.toBe(SUCCESS);

    expect(action).toHaveBeenCalledTimes(i + 1);
    expect(mockTimer.mock.calls).toMatchSnapshot();
  }
  mockTimer.mockClear();
  const action = newAsyncTestAction(3);
  await expect(withRetries(action)).rejects.toThrowErrorMatchingSnapshot();
  expect(action).toHaveBeenCalledTimes(3);
  expect(mockTimer.mock.calls).toMatchSnapshot();
});

it('works correctly with sync actions', async () => {
  for (let i = 0; i < 2; ++i) {
    mockTimer.mockClear();
    const action = newSyncTestAction(i);

    const promise = withRetries(action);
    of(promise).type.toBe<Promise<string>>();
    await expect(promise).resolves.toBe(SUCCESS);

    expect(action).toHaveBeenCalledTimes(i + 1);
    expect(mockTimer.mock.calls).toMatchSnapshot();
  }
  mockTimer.mockClear();
  const action = newSyncTestAction(3);
  await expect(withRetries(action)).rejects.toThrowErrorMatchingSnapshot();
  expect(action).toHaveBeenCalledTimes(3);
  expect(mockTimer.mock.calls).toMatchSnapshot();
});

it('respects custom "maxRetries" and "interval" arguments', async () => {
  for (let i = 0; i < 5; ++i) {
    mockTimer.mockClear();
    const action = newAsyncTestAction(i);
    await expect(withRetries(action, 5, 10)).resolves.toBe(SUCCESS);
    expect(action).toHaveBeenCalledTimes(i + 1);
    expect(mockTimer.mock.calls).toMatchSnapshot();
  }
  mockTimer.mockClear();
  const action = newAsyncTestAction(6);
  await expect(withRetries(action, 5, 10))
    .rejects.toThrowErrorMatchingSnapshot();
  expect(action).toHaveBeenCalledTimes(5);
  expect(mockTimer.mock.calls).toMatchSnapshot();
});
