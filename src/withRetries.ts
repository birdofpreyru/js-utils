import { timer } from './time';

/**
 * Attempts to perform the given async `action` up to `maxRetries` times with
 * the specified `interval`, stopping at the first successful (non-throwing)
 * execution.
 * @param action
 * @param maxRetries Optional. The maximum number of re-tries. Defaults 3.
 * @param interval Optional. The interval between re-tries (in milliseconds).
 *  Defaults to 300ms.
 * @returns Resolves to the result of the successful `action` execution;
 *  or rejects with the error from the last faileda attempt.
 */
export default async function withRetries(
  action: () => unknown,
  maxRetries = 3,
  interval = 300,
) {
  /* eslint-disable no-await-in-loop */
  for (let n = 1; ; ++n) {
    try {
      const res = action();
      return res instanceof Promise ? await res : res;
    } catch (error) {
      if (n < maxRetries) await timer(interval);
      else throw error;
    }
  }
  /* eslint-enable no-await-in-loop */
}
