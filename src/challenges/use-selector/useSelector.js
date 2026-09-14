/**
 * One subscription, an inline selector, and no render you did not need
 *
 * Topics: external stores · selectors · the latest-value ref
 * Read:   https://react.dev/learn/synchronizing-with-effects#subscribing-to-events
 * Read:   https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref
 *
 * @param {{getState: () => *, subscribe: (listener) => Function}} store
 *        `subscribe` returns the function that unsubscribes
 * @param {(state) => *} selector  written inline at the call site, so it is a
 *        different function on every render
 * @param {(a, b) => boolean} isEqual  defaults to Object.is
 * @returns {*} the selected slice
 *
 * Rules:
 *  1. it returns `selector(store.getState())`
 *  2. a store change that alters the slice re-renders with the new value
 *  3. a store change that leaves the slice alone renders nothing
 *  4. it subscribes ONCE for the life of the component, however many renders
 *     happen and however many new selector functions arrive
 *  5. a new selector picking a different slice takes effect straight away, and
 *     from then on that is the slice being watched
 *  6. `isEqual` decides whether the slice changed, so a selector building a
 *     fresh object each call settles instead of re-rendering for ever
 *  7. unmounting unsubscribes
 *
 * Rules 4 and 5 are the same fight as every other hook in this section, with a
 * sharper edge: the subscription's callback has to run the selector from the
 * newest render, but listing the selector as a dependency tears the
 * subscription down and rebuilds it on every keystroke elsewhere in the tree.
 * Rule 6 is the second half — `Object.is` on a freshly built object is false
 * every time, and a re-render that recomputes it is a loop.
 */
export function useSelector(store, selector, isEqual = Object.is) {
  throw new Error('not implemented')
}
