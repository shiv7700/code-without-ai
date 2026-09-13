/**
 * LEVEL 55 — Redux, minus the package
 *
 * Topics: closures · the observer pattern · reducers
 * Read:   https://react.dev/learn/extracting-state-logic-into-a-reducer
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * @param {(state, action) => *} reducer
 * @param {*} initialState
 * @returns {{getState, dispatch, subscribe}}
 *
 * Rules:
 *  1. `getState()` returns the current state; it starts as `initialState`.
 *  2. `dispatch(action)` replaces the state with `reducer(state, action)` and
 *     then notifies every subscriber.
 *  3. Notification happens AFTER the state is replaced — a subscriber calling
 *     `getState()` sees the new value, never the old one.
 *  4. `subscribe(listener)` returns a function that unsubscribes it, and
 *     unsubscribing one must not disturb the others.
 *  5. A subscriber that unsubscribes itself during a notification must not
 *     cause the next subscriber to be skipped.
 *  6. Two stores share nothing.
 *
 * This is level 46's emitter with one event, plus level 07's reducer. Level 81
 * plugs it into React with `useSyncExternalStore`.
 */
export function createStore(reducer, initialState) {
  throw new Error('not implemented')
}
