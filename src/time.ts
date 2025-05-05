import Barrier, { type Executor } from './Barrier';

// This is not very elegant, but as of now TypeScript does not support type
// arithmetic, thus we can't have constants assigned like `MIN_MS = 60 * SEC_MS`
// and have the result type to be 60000 (number literal), it would be just
// the generic number type.
export const SEC_MS = 1000;
export const MIN_MS = 60000; // 60 * SEC_MS
export const HOUR_MS = 3600000; // 60 * MIN_MS
export const DAY_MS = 86400000; // 24 * HOUR_MS
export const YEAR_MS = 31536000000; // 365 * DAY_MS

// TODO: Ok, as we have ended up with a Timer class, mostly to achieve a good
// TypeScript typing for timer() function, it makes sense to expose the class
// from the library as well, and it should be documented later.
export class Timer<T> extends Barrier<void, T> {
  private pAbort: () => void;

  private pTimeout?: number;

  get abort(): () => void {
    return this.pAbort;
  }

  get timeout(): number | undefined {
    return this.pTimeout;
  }

  /**
   * Creates a new, non-initialized instance of Timer. Call .init() method
   * to actually initialize and launch the timer.
   *
   * NOTE: Although it might be tempting to accept `timeout` value as
   * a constructor's argument, it won't work well, because Timer is an
   * extension of Promise (via Barrier), and the way Promises works (in
   * particular their .then() method, which internally calls constructor()
   * with special executor) does not play along with initalization depending
   * on custom parameters done in constructor().
   *
   * @param executor
   */
  constructor(executor?: Executor<T>) {
    super(executor);
    this.pAbort = () => undefined;
  }

  init(timeout: number): this {
    if (this.pTimeout !== undefined) {
      throw Error('This Timer is initialized already');
    }
    this.pTimeout = timeout;
    if (timeout > 0) {
      const id = setTimeout(() => {
        void super.resolve();
      }, timeout);
      this.pAbort = () => {
        clearTimeout(id);
      };
    } else {
      void super.resolve();
    }
    return this;
  }

  // TODO: For async functions TS requires the return type to be the global
  // Promise, thus not allowing to return our Timer type extending that via
  // Barrier. Thus, we don't mark this method async for now, disabling the rule,
  // and we should think more about it in future.
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  then<TR1, TR2>(
    onFulfilled?: ((value: T) => TR1 | PromiseLike<TR1>) | null,
    onRejected?: ((reason: unknown) => TR2 | PromiseLike<TR2>) | null,
  ): Timer<TR1 | TR2> {
    const res = super.then(onFulfilled, onRejected) as Timer<TR1 | TR2>;
    if (this.timeout !== undefined) void res.init(this.timeout);
    return res;
  }
}

/**
 * Creates a Promise, which resolves after the given timeout.
 * @param {number} timeout Timeout [ms].
 * @return {Barrier} Resolves after the timeout. It has additional
 *  .abort() method attached, which cancels the pending timer resolution
 *  (without resolving or rejecting the barrier).
 */
// TODO: For async functions TS requires the return type to be the global
// Promise, thus not allowing to return our Timer type extending that via
// Barrier. Thus, we don't mark this method async for now, disabling the rule,
// and we should think more about it in future.
// eslint-disable-next-line @typescript-eslint/promise-function-async
export function timer(timeout: number): Timer<void> {
  const t = new Timer<void>();
  return t.init(timeout);
}
