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
  private pData: Record<string, EntryT<T>> = {};
  private pOldestTimestamp = Number.MAX_SAFE_INTEGER;

  /** For test use only. */
  get data(): Readonly<Record<string, EntryT<T>>> {
    return this.pData;
  }

  /** For test use only. */
  get oldestTimestamp(): number {
    return this.pOldestTimestamp;
  }

  constructor(
    public readonly maxage: number,
    private getter: (id: string) => T | Promise<T>,
  ) {}

  /** Removes stale items from the cache, and updates .oldestTimestamp. */
  private cleanCache() {
    const deadline = Date.now() - this.maxage;
    this.pOldestTimestamp = Number.MAX_SAFE_INTEGER;
    for (const [key, entry] of Object.entries(this.pData)) {
      const timestamp = getTimestamp(entry);
      if (timestamp < deadline) delete this.pData[key];
      else if (timestamp < this.pOldestTimestamp) {
        this.pOldestTimestamp = timestamp;
      }
    }
  }

  /**
   * Adds entry to the cache.
   * NOTE: It assumes entry's timestamp is the current moment (for the cache
   * cleaning purposes; if it is not, but it is a past timestamp, nothing bad
   * will happen, just some cleaning operation will be skipped).
   */
  private setEntry(id: string, entry: EntryT<T>) {
    this.pData[id] = entry;
    const timestamp = getTimestamp(entry);
    if (timestamp < this.pOldestTimestamp) this.pOldestTimestamp = timestamp;
    else if (this.pOldestTimestamp < timestamp - this.maxage) this.cleanCache();
  }

  /** Adds `datum` to the cache, and removes stale items from the cache. */
  private set(id: string, datum: T): CachedT<T> {
    const res: CachedT<T> = [datum, Date.now()];
    this.setEntry(id, res);
    return res;
  }

  /**
   * Retrieves envelope of the specified datum, either read from the cache,
   * or retrieved using the getter provided at construction time.
   */
  private getEntry(id: string, forceRefresh?: boolean): EntryT<T> {
    const now = Date.now();

    if (!forceRefresh) {
      const cached = this.pData[id];
      if (cached && getTimestamp(cached) >= now - this.maxage) return cached;
    }

    const itemOrPromise = this.getter(id);
    if (!(itemOrPromise instanceof Promise)) {
      return this.set(id, itemOrPromise);
    }

    const promise = addTimestamp(
      itemOrPromise.then((item) => this.set(id, item)),
      now,
    );

    this.setEntry(id, promise);

    return promise;
  }

  /** Gets item. */
  get(id: string, forceRefresh?: boolean): T | Promise<T> {
    const entry = this.getEntry(id, forceRefresh);
    return Array.isArray(entry) ? entry[0] : entry.then((e) => e[0]);
  }
}
