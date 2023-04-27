import Barrier, { type Executor } from './Barrier';

export const SEC_MS = 1000;
export const MIN_MS = 60 * SEC_MS;
export const HOUR_MS = 60 * MIN_MS;
export const DAY_MS = 24 * HOUR_MS;
export const YEAR_MS = 365 * DAY_MS;

class Timer<T> extends Barrier<void, T> {
  private p_abort: () => void;

  get abort(): () => void { return this.p_abort; }

  constructor(executor?: Executor<T>, timeout: number = 0) {
    super(executor);
    if (timeout > 0) {
      const id = setTimeout(super.resolve.bind(this), timeout);
      this.p_abort = () => clearTimeout(id);
    } else {
      this.p_abort = () => {};
      super.resolve();
    }
  }

  then<TR1, TR2>(
    onFulfilled?: ((value: T) => TR1 | PromiseLike<TR1>) | null,
    onRejected?: ((reason: any) => TR2 | PromiseLike<TR2>) | null,
  ): Timer<TR1 | TR2> {
    const res = <Timer<TR1 | TR2>> super.then(onFulfilled, onRejected);
    res.p_abort = this.p_abort;
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
export async function timer(timeout: number) {
  return new Timer<void>(undefined, timeout);
}
