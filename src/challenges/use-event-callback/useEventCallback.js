/**
 * One function object for the component's life, always running the newest body
 *
 * Topics: useRef · useCallback · stable identity
 * Read:   https://react.dev/reference/react/useCallback
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * @param {Function} fn  a fresh arrow on every render, closing over this render's props
 * @returns {Function} a function whose identity never changes
 *
 * Rules:
 *  1. calling it calls `fn`, passing the arguments through and returning its result
 *  2. after a re-render, calling it runs the NEWEST `fn` — the one from the
 *     render that just happened, with that render's variables
 *  3. its identity never changes: the function handed back on render 40 is the
 *     same object handed back on render 1
 *  4. a re-render caused by something the hook knows nothing about changes
 *     neither of the above
 *  5. an effect that runs after a render can call it and reach that render's `fn`
 *
 * Rules 2 and 3 are the whole exercise, and `useCallback` alone cannot give you
 * both. List `fn` as a dependency and you get rule 2 with a brand new function
 * every render, which is the thing you were memoising to avoid. List nothing
 * and you get rule 3 wrapped around the props from the first render, for ever.
 * Every other hook in this section is this one with a timer bolted on.
 */
export function useEventCallback(fn) {
  throw new Error('not implemented')
}
