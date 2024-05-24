import Barrier from '../src/Barrier';

describe('Base usage', () => {
  test('initial values of barrier properties are correct', () => {
    const barrier = new Barrier();
    expect(barrier.rejected).toBe(false);
    expect(barrier.resolved).toBe(false);
    expect(barrier.settled).toBe(false);
  });

  it('resolves', async () => {
    const barrier = new Barrier();
    barrier.resolve('OK');
    expect(barrier.rejected).toBe(false);
    expect(barrier.resolved).toBe(true);
    expect(barrier.settled).toBe(true);
    await expect(barrier).resolves.toBe('OK');
  });

  test('resolve() chaining', async () => {
    const barrier = new Barrier<string>();
    await expect(barrier.resolve('OK')).resolves.toBe('OK');
  });

  it('rejects', async () => {
    const barrier = new Barrier();
    barrier.reject('OK');
    expect(barrier.rejected).toBe(true);
    expect(barrier.resolved).toBe(false);
    expect(barrier.settled).toBe(true);
    await expect(barrier).rejects.toBe('OK');
  });

  test('Barrier supports promise-like executor', async () => {
    const barrier = new Barrier((done) => done('OK'));
    await expect(barrier).resolves.toBe('OK');
  });

  test('reject() chaining', async () => {
    const barrier = new Barrier<string>();
    await expect(barrier.reject(Error('FAIL'))).rejects.toThrow('FAIL');
  });
});

describe('.then()', () => {
  it('resolves if called after the barrier resolution', async () => {
    const barrier = new Barrier();
    barrier.resolve('NO');
    await expect(barrier.then(() => 'OK')).resolves.toBe('OK');
  });

  it('resolves if used before the barrier resolution', async () => {
    const barrier = new Barrier();
    const test = expect(barrier.then(() => 'OK')).resolves.toBe('OK');
    barrier.resolve('NO');
    await test;
  });

  it('returns a barrier reusing the same resolve/reject', async () => {
    const root = new Barrier();
    const child = root.then(() => 'OK');
    child.resolve('NO');
    await expect(root).resolves.toBe('NO');
    await expect(child).resolves.toBe('OK');
  });

  it('.then() correctly substiutes types', async () => {
    {
      const root = new Barrier<string>();
      const child = root.then((s) => s.length);
      child.resolve('result');
      await expect(child).resolves.toBe(6);
    }

    { // Alternative resolution call.
      const root = new Barrier<string>();
      const child = root.then((s) => s.length);
      root.resolve('result');
      await expect(child).resolves.toBe(6);
    }
  });
});

describe('.catch()', () => {
  it('rejects correctly when chained', async () => {
    const barrier = (new Barrier()).catch(() => { throw Error('ERROR'); });
    barrier.reject('OGH');
    await expect(barrier).rejects.toThrow('ERROR');
  });
});

describe('.finally()', () => {
  it('works as expected when chained (I)', async () => {
    const barrier = (new Barrier()).finally(() => { throw Error('ERROR'); });
    barrier.resolve('OK');
    await expect(barrier).rejects.toThrow('ERROR');
  });

  it('works as expected when chained (II)', async () => {
    const barrier = (new Barrier()).finally(() => { throw Error('ERROR'); });
    barrier.reject('OGH');
    await expect(barrier).rejects.toThrow('ERROR');
  });
});
