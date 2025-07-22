type CachedT<T> = [T, number];
type TimestampedPromise<T> = Promise<T> & { timestamp: number };
type EntryT<T> = CachedT<T> | TimestampedPromise<CachedT<T>>;

/** Adds timestamp to the promise. */
function addTimestamp<T>(
  promise: Promise<T>,
  timestamp: number,
): TimestampedPromise<T> {
  const res = promise as TimestampedPromise<T>;
  res.timestamp = timestamp;
  return res;
}

/** Gets entry timestamp. */
function getTimestamp<T>(e: EntryT<T>): number {
  return Array.isArray(e) ? e[1] : e.timestamp;
}

export class Cached<T> {
  private data: Record<string, EntryT<T>> = {};
  private oldestTimestamp = Number.MAX_SAFE_INTEGER;

  /** For test use only. */
  get _data(): Readonly<Record<string, EntryT<T>>> {
    return this.data;
  }

  /** For test use only. */
  get _oldestTimestamp(): number {
    return this.oldestTimestamp;
  }

  constructor(
    public readonly maxage: number,
    private getter: (id: string) => T | Promise<T>,
  ) {}

  /** Removes stale items from the cache, and updates .oldestTimestamp. */
  private cleanCache() {
    const deadline = Date.now() - this.maxage;
    this.oldestTimestamp = Number.MAX_SAFE_INTEGER;
    for (const [key, entry] of Object.entries(this.data)) {
      const timestamp = getTimestamp(entry);
      if (timestamp < deadline) delete this.data[key];
      else if (timestamp < this.oldestTimestamp) {
        this.oldestTimestamp = timestamp;
      }
    }
  }

  /** Adds `datum` to the cache, and removes stale items from the cache. */
  private set(id: string, datum: T): CachedT<T> {
    const now = Date.now();
    if (this.oldestTimestamp < now - this.maxage) this.cleanCache();
    if (now < this.oldestTimestamp) this.oldestTimestamp = now;
    const res: CachedT<T> = [datum, now];
    this.data[id] = res;
    return res;
  }

  /**
   * Retrieves envelope of the specified datum, either read from the cache,
   * or retrieved using the getter provided at construction time.
   */
  private getEntry(id: string, forceRefresh?: boolean): EntryT<T> {
    const now = Date.now();

    if (!forceRefresh) {
      const cached = this.data[id];
      if (cached && getTimestamp(cached) >= now - this.maxage) return cached;
    }

    const itemOrPromise = this.getter(id);
    if (!(itemOrPromise instanceof Promise)) {
      return this.set(id, itemOrPromise);
    }

    const cached = addTimestamp(
      itemOrPromise.then((item) => this.set(id, item)),
      now,
    );
    if (now < this.oldestTimestamp) this.oldestTimestamp = now;
    this.data[id] = cached;
    return cached;
  }

  /** Gets item. */
  get(id: string, forceRefresh?: boolean): T | Promise<T> {
    const entry = this.getEntry(id, forceRefresh);
    return Array.isArray(entry) ? entry[0] : entry.then((e) => e[0]);
  }
}
