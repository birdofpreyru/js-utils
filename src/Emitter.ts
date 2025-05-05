export type Listener<T extends unknown[] = unknown[]> = (...args: T) => void;

/**
 * Simple listeneable data Emitter.
 */
export class Emitter<T extends unknown[] = unknown[]> {
  private pListeners: Array<Listener<T>> = [];

  /**
   * Returns "true" if any listener is connected; "false" otherwise.
   * @return {boolean}
   */
  get hasListeners(): boolean {
    return !!this.pListeners.length;
  }

  get listeners(): ReadonlyArray<Listener<T>> {
    return this.pListeners;
  }

  /**
   * Adds `listener` if it is not already connected.
   * @param {function} listener
   * @return {function} Unsubscribe function.
   */
  addListener(listener: Listener<T>): () => void {
    if (!this.pListeners.includes(listener)) {
      this.pListeners.push(listener);
    }
    return () => {
      this.removeListener(listener);
    };
  }

  /**
   * Calls every connected listener with the given arguments.
   * @param args
   */
  emit(...args: T): void {
    const listeners = this.pListeners.slice();
    for (const listener of listeners) listener(...args);
  }

  /**
   * Removes all connected listeners.
   */
  removeAllListeners(): void {
    this.pListeners = [];
  }

  /**
   * Removes specified `listener`, if connected.
   * @param listener
   */
  removeListener(listener: Listener<T>): void {
    const idx = this.pListeners.indexOf(listener);
    if (idx >= 0) this.pListeners.splice(idx, 1);
  }
}
