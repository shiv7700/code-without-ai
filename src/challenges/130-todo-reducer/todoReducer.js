/**
 * LEVEL 7 — useReducer, but the reducer alone (no React in this file)
 *
 * Topics: useReducer · immutability · pure functions
 * Read:   https://react.dev/learn/extracting-state-logic-into-a-reducer
 * Read:   https://react.dev/learn/updating-arrays-in-state
 *
 * State shape:  { todos: [{ id, text, done }], filter: 'all' | 'active' | 'done' }
 *
 * Actions:
 *   { type: 'added',    id, text }   → append { id, text, done: false }
 *   { type: 'toggled',  id }         → flip that todo's `done`
 *   { type: 'removed',  id }         → drop that todo
 *   { type: 'filtered', filter }     → set the filter
 *   { type: 'cleared' }              → remove every done todo
 *
 * Rules:
 *  1. PURE — same input, same output. No Date.now(), no Math.random(), no fetch.
 *  2. NEVER mutate. Return new objects/arrays. `state.todos.push(...)` is the
 *     bug this whole exercise exists to teach — React compares by reference,
 *     so a mutated array looks unchanged and your UI silently stops updating.
 *  3. an unknown action type returns the SAME state object (not a copy)
 *  4. an action for an id that doesn't exist is a no-op, not a crash
 *
 * Also export `selectVisible(state)` → the todos matching the current filter.
 */
export const initialState = { todos: [], filter: 'all' }

export function todoReducer(state, action) {
  throw new Error('not implemented')
}

export function selectVisible(state) {
  throw new Error('not implemented')
}
