import {
  DAY_MS,
  HOUR_MS,
  MIN_MS,
  SEC_MS,
  YEAR_MS,
  timer,
} from '../ts/time';

test('Misc aliases', () => {
  expect(SEC_MS).toBe(1000);
  expect(MIN_MS).toBe(60 * 1000);
  expect(HOUR_MS).toBe(60 * 60 * 1000);
  expect(DAY_MS).toBe(24 * 60 * 60 * 1000);
  expect(YEAR_MS).toBe(365 * 24 * 60 * 60 * 1000);
});

test('timer()', async () => {
  const before = Date.now();
  await timer(500);
  const after = Date.now();
  expect(after - before >= 500).toBe(true);
});
