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
  private p_resolve: Resolver<T>;

  private p_reject: Rejecter;

  private p_state = STATE.PENDING;

  constructor(executor?: Executor<TR>) {
    let resolveRef: Resolver<TR>;
    let rejectRef: Rejecter;

    super((resolve, reject) => {
      // Note: Enforcing `void` return type because of the BEWARE note below.
      resolveRef = (value: TR | PromiseLike<TR>): void => {
        resolve(value);
        this.p_state = STATE.RESOLVED;

        // BEWARE: Don't try to return `this` here, it will easily cause
        // infinite loops in React Native, which are extremely difficult
        // to troubleshoot (I wasn't able to figure out, are they due to
        // internal Promise implementation in RN, or because of some bad
        // patterns in the host code).
      };

      // Note: Enforcing `void` return type because of the BEWARE note below.
      rejectRef = (reason?: any): void => {
        reject(reason);
        this.p_state = STATE.REJECTED;
      };

      if (executor) executor(resolveRef, rejectRef);
    });

    // NOTE: We assume, the only scenario where TR is not equal T is when
    // the Barrier is constructed by a .then() call on a "parent" barrier,
    // and in that scenario .then() itself will replace .p_resolve by another
    // resolver immediately after this constructor returns.
    this.p_resolve = resolveRef! as Resolver<T>;

    this.p_reject = rejectRef!;
  }

  get resolve() {
    return (arg: Parameters<Resolver<T>>[0]) => {
      this.p_resolve(arg);
      return this;
    };
  }

  get reject() {
    return (arg: Parameters<Rejecter>[0]) => {
      this.p_reject(arg);
      return this;
    };
  }

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
