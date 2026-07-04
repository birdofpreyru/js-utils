import { expect as ts } from 'tstyche';

import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

import { Emitter, type Listener } from '../src';

ts<Listener>().type.toBeAssignableFrom<() => void>();

describe('constructor()', () => {
  it('creates a new emitter with empty listeners array', () => {
    const e = new Emitter();
    expect(e.listeners).toStrictEqual([]);
  });
});

describe('.hasListeners', () => {
  it('returns "false" when no listeners connected', () => {
    const e = new Emitter();
    expect(e.hasListeners).toBe(false);
  });

  it('returns "true" when a listener is connected', () => {
    const e = new Emitter();
    e.addListener(jest.fn<() => void>());
    expect(e.hasListeners).toBe(true);
  });
});

describe('.addListener()', () => {
  it('adds given listeners at most once', () => {
    const e = new Emitter();
    const fnA = jest.fn<() => void>().mockName('A');
    const fnB = jest.fn<() => void>().mockName('B');
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
    const fnA = jest.fn<() => void>().mockName('A');
    const fnB = jest.fn<() => void>().mockName('B');
    const fnC = jest.fn<() => void>().mockName('C');
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
    const fnA = jest.fn<() => void>().mockName('A');
    const fnB = jest.fn<() => void>().mockName('B');
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

  it('notifies the listeners connected at the moment of .emit() call', () => {
    const e = new Emitter();
    const fnB = jest.fn<() => void>().mockName('B');
    const fnC = jest.fn<() => void>().mockName('C');
    const fnA = jest.fn<() => void>(() => {
      e.removeListener(fnB);
      e.addListener(fnC);
    }).mockName('A');
    e.addListener(fnA);
    e.addListener(fnB);
    e.emit();
    expect(fnA).toHaveBeenCalledTimes(1);
    expect(fnB).toHaveBeenCalledTimes(1);
    expect(fnC).not.toHaveBeenCalled();
  });
});

describe('.removeAllListeners', () => {
  it('removes all connected listeners', () => {
    const e = new Emitter();
    const fnA = jest.fn<() => void>().mockName('A');
    const fnB = jest.fn<() => void>().mockName('B');
    const fnC = jest.fn<() => void>().mockName('C');
    e.addListener(fnA);
    e.addListener(fnB);
    e.addListener(fnC);
    expect(e.listeners).toMatchSnapshot();
    e.removeAllListeners();
    expect(e.listeners).toMatchSnapshot();
  });
});

describe('.removeListener()', () => {
  it('removes given listener if it is connected', () => {
    const e = new Emitter();
    const fnA = jest.fn<() => void>().mockName('A');
    const fnB = jest.fn<() => void>().mockName('B');
    const fnC = jest.fn<() => void>().mockName('C');
    const fnD = jest.fn<() => void>().mockName('D');
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
