import Semaphore from '../src/Semaphore';
import { timer } from '../src/time';

describe('constructor', () => {
  it('creates non-ready semaphore by default', () => {
    const sem = new Semaphore();
    expect(sem.ready).toBe(false);
  });

  it('creates ready semaphore, when opted', () => {
    const sem = new Semaphore(true);
    expect(sem.ready).toBe(true);
  });
});

describe('basic logic', () => {
  test('seize() turns semaphore into non-ready state', async () => {
    const sem = new Semaphore(true);
    expect(sem.ready).toBe(true);
    await sem.seize();
    expect(sem.ready).toBe(false);
  });

  test('waitReady() does not turn semaphore into non-ready state', async () => {
    const sem = new Semaphore(true);
    expect(sem.ready).toBe(true);
    await sem.waitReady();
    expect(sem.ready).toBe(true);
  });

  test('waitReady(true) turns semaphore into non-ready state', async () => {
    const sem = new Semaphore(true);
    expect(sem.ready).toBe(true);
    await sem.waitReady(true);
    expect(sem.ready).toBe(false);
  });
});

describe('concurrent use', () => {
  test('.waitReady() can be used as a simple barrier', async () => {
    let flag = false;
    const sem = new Semaphore();

    void (async () => {
      await sem.waitReady();
      flag = true;
    })();

    await timer(10);
    expect(flag).toBe(false);
    sem.setReady(true);
    await timer(10);
    expect(flag).toBe(true);
  });

  test('.waitReady() can be used for mutual exclusion', async () => {
    const dT = 30;
    const signals: string[] = [];
    const sem = new Semaphore();

    const newFlow = async (signal: string) => {
      for (let i = 1; i <= 2; ++i) {
        await sem.waitReady(true);
        signals.push(`${signal}-${i}`);
        await timer(dT);
        sem.setReady(true);
      }
    };

    void newFlow('A');
    void newFlow('B');

    expect(signals).toStrictEqual([]);
    sem.setReady(true);
    await timer(dT / 2);
    expect(signals).toStrictEqual(['A-1']);
    await timer(dT);
    expect(signals).toStrictEqual(['A-1', 'B-1']);
    await timer(dT);
    expect(signals).toStrictEqual(['A-1', 'B-1', 'A-2']);
    await timer(dT);
    expect(signals).toStrictEqual(['A-1', 'B-1', 'A-2', 'B-2']);
  });

  test('.seize() can be used for mutual exclusion', async () => {
    const dT = 30;
    const signals: string[] = [];
    const sem = new Semaphore();

    const newFlow = async (signal: string) => {
      for (let i = 1; i <= 2; ++i) {
        await sem.seize();
        expect(sem.ready).toBe(false);
        signals.push(`${signal}-${i}`);
        await timer(dT);
        sem.setReady(true);
      }
    };

    void newFlow('A');
    void newFlow('B');

    expect(signals).toStrictEqual([]);
    sem.setReady(true);
    await timer(dT / 2);
    expect(signals).toStrictEqual(['A-1']);
    await timer(dT);
    expect(signals).toStrictEqual(['A-1', 'B-1']);
    await timer(dT);
    expect(signals).toStrictEqual(['A-1', 'B-1', 'A-2']);
    await timer(dT);
    expect(signals).toStrictEqual(['A-1', 'B-1', 'A-2', 'B-2']);
  });

  test(
    '.waitReady() does not skip the drain queue when the semaphore is ready',
    async () => {
      const signals: string[] = [];
      const sem = new Semaphore();
      const newFlow = async (signal: string) => {
        await sem.waitReady();
        signals.push(signal);
      };
      void newFlow('A');
      void newFlow('B');
      sem.setReady(true);
      void newFlow('C');
      await timer(10);
      expect(signals).toStrictEqual(['A', 'B', 'C']);
    },
  );
});
