type Listener<T extends unknown[] = unknown[]> = (...args: T) => void;

/**
 * Simple listeneable data Emitter.
 */
export default class Emitter<T extends unknown[] = unknown[]> {
  private p_listeners: Listener<T>[] = [];

  /**
   * Returns "true" if any listener is connected; "false" otherwise.
   * @return {boolean}
   */
  get hasListeners(): boolean {
    return !!this.p_listeners.length;
  }

  get listeners(): ReadonlyArray<Listener<T>> { return this.p_listeners; }

  /**
   * Adds `listener` if it is not already connected.
   * @param {function} listener
   * @return {function} Unsubscribe function.
   */
  addListener(listener: Listener<T>): () => void {
    if (!this.p_listeners.includes(listener)) {
      this.p_listeners.push(listener);
    }
    return () => this.removeListener(listener);
  }

  /**
   * Calls every connected listener with the given arguments.
   * @param args
   */
  emit(...args: T) {
    const { p_listeners: listeners } = this;
    for (let i = 0; i < listeners.length; ++i) {
      listeners[i](...args);
    }
  }

  /**
   * Removes specified `listener`, if connected.
   * @param listener
   */
  removeListener(listener: Listener<T>) {
    const idx = this.p_listeners.indexOf(listener);
    if (idx >= 0) this.p_listeners.splice(idx, 1);
  }
}
