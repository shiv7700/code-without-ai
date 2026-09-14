/**
 * One reducer for the whole form, and a reset that still knows the way back
 *
 * Topics: useReducer · one handler for many fields · pure reducers
 * Read:   https://react.dev/learn/extracting-state-logic-into-a-reducer
 * Read:   https://react.dev/learn/updating-objects-in-state
 *
 * @param {{name: string, email: string}} initial
 * @param {(values: object) => void} onSave
 *
 * Render inputs labelled "Name" and "Email", and buttons "Save" and "Reset".
 *
 * Rules:
 *  1. ONE useReducer holds both fields — no useState per input
 *  2. both inputs share one change handler, dispatching
 *     `{ type: 'changed', field, value }`
 *  3. "Reset" dispatches `{ type: 'reset', values }` and puts every field back
 *     to `initial`
 *  4. "Save" calls `onSave` with the current values
 *  5. Reset works just as well after a save, and any number of times
 *  6. `initial` is never modified
 *
 * The reducer starts out holding the very object it was handed, so
 * `state[action.field] = action.value` writes straight into `initial`. The
 * typing still looks right, as long as you remembered to return a copy — and
 * then Reset carefully restores the values you have just finished typing.
 */
export default function ReducerForm({ initial, onSave }) {
  return null
}
