type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Rejecter = (reason?: any) => void;
type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;

/**
 * Barrier is just a Promise which has resolve and reject exposed as instance
 * methods.
 *
 * Docs: https://dr.pogodin.studio/docs/react-utils/docs/api/classes/Barrier
 */
export class Barrier<T, TR = T> extends Promise<TR> {
  private _resolve: Resolver<T> | Resolver<TR>;
  private _resolved = false;
  private _reject: Rejecter;
  private _rejected = false;

  constructor(executor?: Executor<TR>) {
    let resolveRef: Resolver<TR>;
    let rejectRef: Rejecter;

    super((resolve, reject) => {
      resolveRef = (value: TR | PromiseLike<TR>) => {
        resolve(value);
        this._resolved = true;
      }
      rejectRef = (reason?: any) => {
        reject(reason);
        this._rejected = true;
      }
      if (executor) executor(resolveRef, rejectRef);
    });

    this._resolve = resolveRef!;
    this._reject = rejectRef!;
  }

  get resolve() { return <Resolver<T>>this._resolve; }
  get resolved() { return this._resolved; }
  get reject() { return this._reject; }
  get rejected() { return this._rejected; }

  then<TR1,TR2>(
    onFulfilled?: ((value: TR) => TR1 | PromiseLike<TR1>) | null,
    onRejected?: ((reason: any) => TR2 | PromiseLike<TR2>) | null,
  ): Barrier<T, TR1|TR2> {
    const res = <Barrier<T, TR1|TR2>>super.then(onFulfilled, onRejected);
    res._resolve = this.resolve;
    res._reject = this.reject;
    return res;
  }
}

/**
 * Creates a new Barrier.
 * @returns {Barrier}
 */
export function newBarrier<T>(executor?: Executor<T>) {
  return new Barrier<T>(executor);
}
