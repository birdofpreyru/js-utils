import { expect as of } from 'tstyche';

import {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  timer,
} from '../src/time';

test('Misc aliases', () => {
  expect(SEC_MS).toBe(1000);
  of(SEC_MS).type.toBe<1000>();

  expect(MIN_MS).toBe(60 * SEC_MS);
  of(MIN_MS).type.toBe<60000>();

  expect(HOUR_MS).toBe(60 * MIN_MS);
  of(HOUR_MS).type.toBe<3600000>();

  expect(DAY_MS).toBe(24 * HOUR_MS);
  of(DAY_MS).type.toBe<86400000>();

  expect(YEAR_MS).toBe(365 * DAY_MS);
  of(YEAR_MS).type.toBe<31536000000>();
});

describe('timer()', () => {
  test('basic use case', async () => {
    const before = Date.now();
    const t = timer(500);
    await t;
    const after = Date.now();
    expect(t.timeout).toBe(500);
    expect(after - before).toBeGreaterThanOrEqual(500);
  });

  test('.then()', async () => {
    const before = Date.now();
    const t = timer(500).then(() => 'OK');
    await t;
    const dt = Date.now() - before;
    expect(t.timeout).toBe(500);
    expect(dt).toBeGreaterThanOrEqual(500);
    expect(dt).toBeLessThan(750);
  });
});
