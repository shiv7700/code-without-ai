/**
 * LEVEL 11 — persisting state, and the traps around it
 *
 * Topics: lazy initial state · custom hooks · window events
 * Read:   https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 * Read:   https://react.dev/learn/synchronizing-with-effects#subscribing-to-events
 *
 * @param {string} key
 * @param {*} initialValue  a value, OR a function that returns one (lazy init)
 * @returns {[any, Function]}  [value, setValue]
 *
 * Rules:
 *  1. first render reads localStorage[key]; if nothing is stored, use initialValue
 *  2. `setValue` takes a value OR an updater fn, like setState:
 *       setValue(5)  and  setValue(n => n + 1)  both work
 *  3. every write also writes JSON to localStorage
 *  4. if initialValue is a function it must be called AT MOST ONCE — not on
 *     every render. (useState has a form for exactly this.)
 *  5. garbage in localStorage (not valid JSON) must not crash the app —
 *     fall back to initialValue
 *  6. `setValue` identity is stable across re-renders
 *  7. a `storage` event from another tab updates this tab's value
 *
 * Rule 5 is the one that bites in production: one bad write, and every user
 * with that key in their browser gets a white screen forever.
 */
export function useLocalStorage(key, initialValue) {
  throw new Error('not implemented')
}
