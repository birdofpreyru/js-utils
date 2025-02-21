import Barrier from './Barrier';

/**
 * Implements a simple semaphore for async code logic.
 */
export default class Semaphore {
  constructor(ready = false) {
    this.p_ready = !!ready;
  }

  get ready() { return this.p_ready; }

  setReady(ready: boolean) {
    const bool = !!ready;
    if (this.p_ready !== bool) {
      this.p_ready = bool;
      if (bool && !this.p_draining && this.p_queue.length) {
        this.p_drainQueue();
      }
    }
  }

  /**
   * Waits until the semaphore is ready, and marks it as non-ready (seizes it).
   * @return {Promise}
   */
  async seize() {
    return this.waitReady(true);
  }

  async waitReady(seize = false) {
    if (!this.p_ready || this.p_queue.length) {
      const barrier = new Barrier<void>();
      this.p_queue.push(barrier);
      await barrier;
      if (seize) this.p_ready = false;
      this.p_drainLock!.resolve();
    } else if (seize) this.p_ready = false;
  }

  // Private members below this point.

  /**
   * If semaphore is ready, it releases the next barrier in the queue, if any,
   * and reschedules itself for a call in the next event loop iteration.
   * Otherwise, it breaks the queue draining loop, which will be restarted
   * the next time the semaphore is set ready.
   */
  async p_drainQueue() {
    this.p_draining = true;
    while (this.p_ready && this.p_queue.length) {
      this.p_drainLock = new Barrier();
      this.p_queue[0]!.resolve();
      await this.p_drainLock; // eslint-disable-line no-await-in-loop
      this.p_queue.shift();
    }
    this.p_draining = false;
    this.p_drainLock = null;
  }

  // "true" when the drain queue process is running (and thus no need to start
  // a new one).
  private p_draining = false;

  // Each time a Promise from drain queue is resolved this drainLock is set
  // to block further queue draining until the promise resolution handler
  // (.seize() or .waitReady()) unlocks it, thus confirming it is fine
  // to continue the draining. This is specifically important for .seize(),
  // which should have a chance to switch semaphore state to non-ready prior
  // to next Promise in the queue being unlocked.
  private p_drainLock: Barrier<void> | null = null;

  // The array of barriers set for each async code flow awaiting for
  // the Semaphore to become ready.
  private p_queue: Barrier<void>[] = [];

  private p_ready: boolean;
}
