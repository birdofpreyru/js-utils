type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Rejecter = (reason?: any) => void;
export type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;

enum STATE {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  RESOLVED = 'RESOLVED',
}

/**
 * Barrier is just a Promise which has resolve and reject exposed as instance
 * methods.
 *
 * Docs: https://dr.pogodin.studio/docs/react-utils/docs/api/classes/Barrier
 */
export default class Barrier<T, TR = T> extends Promise<TR> {
  private p_resolve: Resolver<T> | Resolver<TR>;

  private p_reject: Rejecter;

  private p_state = STATE.PENDING;

  constructor(executor?: Executor<TR>) {
    let resolveRef: Resolver<TR>;
    let rejectRef: Rejecter;

    super((resolve, reject) => {
      resolveRef = (value: TR | PromiseLike<TR>) => {
        resolve(value);
        this.p_state = STATE.RESOLVED;
      };
      rejectRef = (reason?: any) => {
        reject(reason);
        this.p_state = STATE.REJECTED;
      };
      if (executor) executor(resolveRef, rejectRef);
    });

    this.p_resolve = resolveRef!;
    this.p_reject = rejectRef!;
  }

  get resolve() { return <Resolver<T>> this.p_resolve; }

  get reject() { return this.p_reject; }

  get resolved() { return this.p_state === STATE.RESOLVED; }

  get rejected() { return this.p_state === STATE.REJECTED; }

  get settled() { return this.p_state !== STATE.PENDING; }

  catch<TR1>(
    onRejected?: ((reason: any) => TR1 | PromiseLike<TR1>) | null,
  ): Barrier<T, TR1> {
    return <Barrier<T, TR1>> super.catch(onRejected);
  }

  finally(onFinally?: (() => void) | null): Barrier<TR> {
    return <Barrier<TR>> super.finally(onFinally);
  }

  then<TR1, TR2>(
    onFulfilled?: ((value: TR) => TR1 | PromiseLike<TR1>) | null,
    onRejected?: ((reason: any) => TR2 | PromiseLike<TR2>) | null,
  ): Barrier<T, TR1 | TR2> {
    const res = <Barrier<T, TR1 | TR2>> super.then(onFulfilled, onRejected);
    res.p_resolve = this.resolve;
    res.p_reject = this.reject;
    return res;
  }
}
