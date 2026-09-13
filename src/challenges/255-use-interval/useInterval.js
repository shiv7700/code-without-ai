/**
 * LEVEL 6 — effect cleanup + the stale closure (Dan Abramov's classic)
 *
 * Topics: useRef · effect cleanup · stale closure
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * @param {Function} callback  runs every `delay` ms
 * @param {number|null} delay  null = paused
 *
 * Rules:
 *  1. calls `callback` every `delay` ms
 *  2. `delay = null` pauses — no ticks at all
 *  3. changing `delay` restarts the interval at the new rate (only ONE interval alive)
 *  4. always calls the LATEST `callback`, even though the interval was set up once
 *  5. unmount clears the interval
 *
 * Rule 4 is the trap. If you put `callback` in the dep array you satisfy it —
 * but an inline arrow is a new function every render, so the interval restarts
 * on every render and never actually fires. You need the other tool.
 */
export function useInterval(callback, delay) {
  throw new Error('not implemented')
}
