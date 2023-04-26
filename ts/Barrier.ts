type Resolver<T> = (value: T | PromiseLike<T>) => void;
type Rejecter = (reason?: any) => void;
type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;

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
export class Barrier<T, TR = T> extends Promise<TR> {
  private resolver: Resolver<T> | Resolver<TR>;

  private rejecter: Rejecter;

  private state = STATE.PENDING;

  constructor(executor?: Executor<TR>) {
    let resolveRef: Resolver<TR>;
    let rejectRef: Rejecter;

    super((resolve, reject) => {
      resolveRef = (value: TR | PromiseLike<TR>) => {
        resolve(value);
        this.state = STATE.RESOLVED;
      };
      rejectRef = (reason?: any) => {
        reject(reason);
        this.state = STATE.REJECTED;
      };
      if (executor) executor(resolveRef, rejectRef);
    });

    this.resolver = resolveRef!;
    this.rejecter = rejectRef!;
  }

  get resolve() { return <Resolver<T>> this.resolver; }

  get reject() { return this.rejecter; }

  get resolved() { return this.state === STATE.RESOLVED; }

  get rejected() { return this.state === STATE.REJECTED; }

  get settled() { return this.state !== STATE.PENDING; }

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
    res.resolver = this.resolve;
    res.rejecter = this.reject;
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
