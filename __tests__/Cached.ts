/* eslint-disable no-underscore-dangle */

import mockdate from 'mockdate';

import { Cached, timer } from '../src';

mockdate.set('2025-07-18Z');

it('passes base test', async () => {
  const timeA1 = Date.now();
  const getter = jest.fn(async (id) => {
    await timer(100);
    return `item-${id}`;
  });
  const cached = new Cached<string>(1000, getter);

  const a1 = cached.get('A');
  const a2 = cached.get('A');
  expect(cached._oldestTimestamp).toBe(timeA1);
  mockdate.set(timeA1 + 100);
  const timeA2 = Date.now();
  await expect(a1).resolves.toBe('item-A');
  await expect(a2).resolves.toBe('item-A');

  // Until a cache clean the oldest timestamp remains equal to the original
  // promise timestamp.
  expect(cached._oldestTimestamp).toBe(timeA1);

  expect(cached.get('A')).toBe('item-A');

  // At this time the original promise timestamp (timeA1) is already stale,
  // but the promise resolution timestamp (timeA2) is still fresh.
  mockdate.set(timeA2 + 950);

  expect(cached.get('A')).toBe('item-A');
  expect(getter).toHaveBeenCalledTimes(1);

  const timeB = Date.now();
  await expect(cached.get('B')).resolves.toBe('item-B');
  expect(getter).toHaveBeenCalledTimes(2);
  expect(Object.keys(cached._data)).toStrictEqual(['A', 'B']);

  // Now the oldest timestamp equals to the resolution of the first promise
  // for A item.
  expect(cached._oldestTimestamp).toBe(timeA2);

  mockdate.set(timeB + 1000);
  await expect(cached.get('A')).resolves.toBe('item-A');
  expect(getter).toHaveBeenCalledTimes(3);
  expect(Object.keys(cached._data)).toStrictEqual(['A', 'B']);
  expect(cached._oldestTimestamp).toBe(timeB);

  const timeA3 = Date.now();
  mockdate.set(timeA3 + 1000);
  const d = cached.get('D');
  await expect(d).resolves.toBe('item-D');
  expect(getter).toHaveBeenCalledTimes(4);
  expect(Object.keys(cached._data)).toStrictEqual(['A', 'D']);
  expect(cached._oldestTimestamp).toBe(timeA3);
});

it('passes tests for sync getter', () => {
  const timeA = Date.now();
  const getter = jest.fn((id) => `item-${id}`);
  const cached = new Cached(1000, getter);

  expect(cached.get('A')).toBe('item-A');
  expect(cached._oldestTimestamp).toBe(timeA);

  expect(cached.get('A')).toBe('item-A');
  expect(getter).toHaveBeenCalledTimes(1);
});
