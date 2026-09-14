/**
 * The initial value is worked out once, or on every single render
 *
 * Topics: lazy initialiser · what runs on every render · initial state
 * Read:   https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
 * Read:   https://react.dev/learn/state-a-components-memory
 *
 * @param {() => string[]} makeItems  expensive — it must run at most once
 *
 * Render a <ul> of the items, an input labelled "New item" and a button "Add".
 *
 * Rules:
 *  1. the list starts as whatever `makeItems()` returned
 *  2. "Add" appends what was typed and empties the input
 *  3. adding nothing does nothing
 *  4. `makeItems` is called exactly ONCE, however many renders happen — typing
 *     a character renders, and must not call it again
 *  5. re-rendering with a different `makeItems` does not call that one either.
 *     Initial state is initial
 *
 * `useState(makeItems())` reads perfectly and is wrong. The call happens on
 * every render, React throws the result away every time after the first, and
 * nothing on screen ever looks different — the only symptom is the work
 * quietly going on in the background. The fix is one pair of characters, and
 * knowing which pair.
 */
export default function SeededList({ makeItems }) {
  return null
}
