export type Executor<T> = ConstructorParameters<typeof Promise<T>>[0];

type Resolver<T> = Parameters<Executor<T>>[0];
type Rejecter = Parameters<Executor<unknown>>[1];

enum STATE {
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  RESOLVED = 'RESOLVED',
}

/**
 * Barrier is just a Promise which has resolve and reject exposed as instance
 * methods.
 *
 * It has two generic arguments T and TR which correspond to the argument of
 * the .resolve() method, and to the value resolved by the promise (barrier).
 * For a simple barrier TR equals to T, however for barriers created via .then()
 * chain, T corresponds to the argument of the original barrier, and TR to
 * the value resolved by the latest promise in the chain. Consider this:
 *
 * const b = new Barrier<string>();
 * b.resolve('result');
 * const s = await b; // `s` has `string` type, and equals "result".
 *
 * const b = (new Barrier<string>()).then((s) => s.length);
 * b.resolve('result'); // Chained barrier exposes .resolve() method of
 *                      // the first barrier in the chain, which expects
 *                      // `string` arugment (T), but the chained barrier
 *                      // resolves to `number` (TR).
 * const n = await b; // `n` has `number` type, and equals 6.
 *
 * Docs: https://dr.pogodin.studio/docs/react-utils/docs/api/classes/Barrier
 */
export default class Barrier<T = unknown, TR = T> extends Promise<TR> {
  private pResolve: Resolver<T>;

  private pReject: Rejecter;

  private pState = STATE.PENDING;

  constructor(executor?: Executor<TR>) {
    let resolveRef: Resolver<TR>;
    let rejectRef: Rejecter;

    super((resolve, reject) => {
      // Note: Enforcing `void` return type because of the BEWARE note below.
      resolveRef = (value: TR | PromiseLike<TR>): void => {
        resolve(value);
        this.pState = STATE.RESOLVED;

        // BEWARE: Don't try to return `this` here, it will easily cause
        // infinite loops in React Native, which are extremely difficult
        // to troubleshoot (I wasn't able to figure out, are they due to
        // internal Promise implementation in RN, or because of some bad
        // patterns in the host code).
      };

      // Note: Enforcing `void` return type because of the BEWARE note below.
      rejectRef = (reason?: unknown): void => {
        reject(reason);
        this.pState = STATE.REJECTED;
      };

      if (executor) executor(resolveRef, rejectRef);
    });

    // NOTE: We assume, the only scenario where TR is not equal T is when
    // the Barrier is constructed by a .then() call on a "parent" barrier,
    // and in that scenario .then() itself will replace .p_resolve by another
    // resolver immediately after this constructor returns.
    this.pResolve = resolveRef! as Resolver<T>;

    this.pReject = rejectRef!;
  }

  get resolve() {
    return (arg: Parameters<Resolver<T>>[0]): this => {
      this.pResolve(arg);
      return this;
    };
  }

  get reject() {
    return (arg: Parameters<Rejecter>[0]): this => {
      this.pReject(arg);
      return this;
    };
  }

  get resolved(): boolean {
    return this.pState === STATE.RESOLVED;
  }

  get rejected(): boolean {
    return this.pState === STATE.REJECTED;
  }

  get settled(): boolean {
    return this.pState !== STATE.PENDING;
  }

  // TODO: For async functions TS requires the return type to be the global
  // Promise, thus not allowing to return our Barrier type extending it.
  // Thus, we don't mark this method async for now, disabling the rule,
  // and we should think more about it in future.
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  catch<TR1>(
    onRejected?: ((reason: unknown) => TR1 | PromiseLike<TR1>) | null,
  ): Barrier<T, TR1> {
    return super.catch(onRejected) as Barrier<T, TR1>;
  }

  // TODO: For async functions TS requires the return type to be the global
  // Promise, thus not allowing to return our Barrier type extending it.
  // Thus, we don't mark this method async for now, disabling the rule,
  // and we should think more about it in future.
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  finally(onFinally?: (() => void) | null): Barrier<TR> {
    return super.finally(onFinally) as Barrier<TR>;
  }

  // TODO: For async functions TS requires the return type to be the global
  // Promise, thus not allowing to return our Barrier type extending it.
  // Thus, we don't mark this method async for now, disabling the rule,
  // and we should think more about it in future.
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  then<TR1, TR2>(
    onFulfilled?: ((value: TR) => TR1 | PromiseLike<TR1>) | null,
    onRejected?: ((reason: unknown) => TR2 | PromiseLike<TR2>) | null,
  ): Barrier<T, TR1 | TR2> {
    const res = super.then(onFulfilled, onRejected) as Barrier<T, TR1 | TR2>;
    // TODO: Revise later.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    res.pResolve = this.resolve;
    // TODO: Revise later.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    res.pReject = this.reject;
    return res;
  }
}
