import Emitter from '../ts/Emitter';

describe('constructor()', () => {
  it('creates a new emitter with empty listeners array', () => {
    const e = new Emitter();
    expect(e.listeners).toEqual([]);
  });
});

describe('.hasListeners', () => {
  it('returns "false" when no listeners connected', () => {
    const e = new Emitter();
    expect(e.hasListeners).toBe(false);
  });

  it('returns "true" when a listener is connected', () => {
    const e = new Emitter();
    e.addListener(jest.fn());
    expect(e.hasListeners).toBe(true);
  });
});

describe('.addListener()', () => {
  it('adds given listeners at most once', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');
    e.addListener(fnA);
    expect(e.listeners).toMatchSnapshot();
    e.addListener(fnA);
    expect(e.listeners).toMatchSnapshot();
    e.addListener(fnB);
    expect(e.listeners).toMatchSnapshot();
    e.addListener(fnA);
    expect(e.listeners).toMatchSnapshot();
  });

  it('removes functional unsubscribe function', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');
    const fnC = jest.fn().mockName('C');
    e.addListener(fnA);
    const unB = e.addListener(fnB);
    const unC = e.addListener(fnC);
    expect(e.listeners).toMatchSnapshot();
    unB();
    expect(e.listeners).toMatchSnapshot();
    unC();
    expect(e.listeners).toMatchSnapshot();
    unC();
    expect(e.listeners).toMatchSnapshot();
  });
});

describe('.emit()', () => {
  it('calls connected listeners with given arguments', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');
    e.addListener(fnA);
    e.addListener(fnB);
    e.emit('ARG1', 'arg2');
    expect(fnA.mock.calls).toMatchSnapshot();
    expect(fnB.mock.calls).toMatchSnapshot();
    e.removeListener(fnA);
    e.emit('second call');
    expect(fnA.mock.calls).toMatchSnapshot();
    expect(fnB.mock.calls).toMatchSnapshot();
  });
});

describe('.removeListener()', () => {
  it('removes given listener if it is connected', () => {
    const e = new Emitter();
    const fnA = jest.fn().mockName('A');
    const fnB = jest.fn().mockName('B');
    const fnC = jest.fn().mockName('C');
    const fnD = jest.fn().mockName('D');
    e.addListener(fnA);
    e.addListener(fnB);
    e.addListener(fnC);
    e.addListener(fnD);
    expect(e.listeners).toMatchSnapshot();
    e.removeListener(fnA);
    expect(e.listeners).toMatchSnapshot();
    e.removeListener(fnC);
    expect(e.listeners).toMatchSnapshot();
    e.removeListener(fnA);
    e.removeListener(fnC);
    expect(e.listeners).toMatchSnapshot();
  });
});
