import Barrier from './Barrier';

/**
 * Implements a simple semaphore for async code logic.
 */
export default class Semaphore {
  constructor(ready = false) {
    this.pReady = !!ready;
  }

  get ready(): boolean {
    return this.pReady;
  }

  setReady(ready: boolean): void {
    const bool = !!ready;
    if (this.pReady !== bool) {
      this.pReady = bool;
      if (bool && !this.pDraining && this.pQueue.length) {
        void this.pDrainQueue();
      }
    }
  }

  /**
   * Waits until the semaphore is ready, and marks it as non-ready (seizes it).
   */
  async seize(): Promise<void> {
    return this.waitReady(true);
  }

  async waitReady(seize = false): Promise<void> {
    if (!this.pReady || this.pQueue.length) {
      const barrier = new Barrier<void>();
      this.pQueue.push(barrier);
      await barrier;
      if (seize) this.pReady = false;
      void this.pDrainLock!.resolve();
    } else if (seize) this.pReady = false;
  }

  // Private members below this point.

  /**
   * If semaphore is ready, it releases the next barrier in the queue, if any,
   * and reschedules itself for a call in the next event loop iteration.
   * Otherwise, it breaks the queue draining loop, which will be restarted
   * the next time the semaphore is set ready.
   */
  async pDrainQueue(): Promise<void> {
    this.pDraining = true;
    while (this.pReady && this.pQueue.length) {
      this.pDrainLock = new Barrier();
      void this.pQueue[0]!.resolve();
      await this.pDrainLock;
      void this.pQueue.shift();
    }
    this.pDraining = false;
    this.pDrainLock = null;
  }

  // "true" when the drain queue process is running (and thus no need to start
  // a new one).
  private pDraining = false;

  // Each time a Promise from drain queue is resolved this drainLock is set
  // to block further queue draining until the promise resolution handler
  // (.seize() or .waitReady()) unlocks it, thus confirming it is fine
  // to continue the draining. This is specifically important for .seize(),
  // which should have a chance to switch semaphore state to non-ready prior
  // to next Promise in the queue being unlocked.
  private pDrainLock: Barrier<void> | null = null;

  // The array of barriers set for each async code flow awaiting for
  // the Semaphore to become ready.
  private pQueue: Array<Barrier<void>> = [];

  private pReady: boolean;
}
