import {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  timer,
} from '../../js';

test('Misc aliases', () => {
  expect(SEC_MS).toBe(1000);
  expect(MIN_MS).toBe(60 * 1000);
  expect(HOUR_MS).toBe(60 * 60 * 1000);
  expect(DAY_MS).toBe(24 * 60 * 60 * 1000);
  expect(YEAR_MS).toBe(365 * 24 * 60 * 60 * 1000);
});

describe('timer()', () => {
  test('basic use case', async () => {
    const before = Date.now();
    const t = timer(500);
    await t;
    const after = Date.now();
    expect(t.timeout).toBe(500);
    expect(after - before >= 500).toBe(true);
  });

  test('.then()', async () => {
    const before = Date.now();
    const t = timer(500).then(() => 'OK');
    await t;
    const dt = Date.now() - before;
    expect(t.timeout).toBe(500);
    expect(dt >= 500).toBe(true);
    expect(dt < 750).toBe(true);
  });
});
