/**
 * LEVEL 81 — subscribing React to something that is not React
 *
 * Topics: useSyncExternalStore · selectors · snapshot identity
 * Read:   https://react.dev/reference/react/useSyncExternalStore
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {{getState, subscribe}} store  subscribe(listener) returns unsubscribe
 * @param {(state) => *} selector
 * @returns {*} the selected slice
 *
 * Rules:
 *  1. Returns `selector(store.getState())`.
 *  2. A store change that alters the selected slice re-renders the component.
 *  3. A change that does NOT alter it must not re-render. Watching `count`
 *     means a new `name` costs nothing.
 *  4. Setting the same value again re-renders nothing.
 *  5. It subscribes on mount and unsubscribes on unmount — exactly one
 *     listener per mounted component.
 *  6. Several components may watch different slices of the same store.
 *
 * React compares snapshots with `Object.is`, which is where rules 2, 3 and 4
 * all come from — and why a selector returning a fresh object every call
 * would loop forever. Level 55 built the store; this is the other half.
 */
export function useStore(store, selector) {
  throw new Error('not implemented')
}
