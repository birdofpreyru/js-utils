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
export default async function withRetries<T>(
  action: () => T,
  maxRetries = 3,
  interval = 300,
): Promise<Awaited<T>> {
  for (let n = 1; ; ++n) {
    try {
      const res = action();
      return res instanceof Promise ? await res : (res as Awaited<T>);
    } catch (error) {
      if (n < maxRetries) await timer(interval);
      else throw error;
    }
  }
}
