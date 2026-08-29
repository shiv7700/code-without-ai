/**
 * LEVEL 19 — state as a history, not a value
 *
 * Topics: choosing the state structure · history stacks
 * Read:   https://react.dev/learn/choosing-the-state-structure
 * Read:   https://react.dev/learn/extracting-state-logic-into-a-reducer
 *
 * @param {*} initial
 * @returns {{
 *   state, set, undo, redo, reset,
 *   canUndo, canRedo,
 * }}
 *
 * Rules:
 *  1. `set(value)` or `set(prev => next)` moves to a new state and remembers
 *     the old one
 *  2. `undo()` steps back, `redo()` steps forward
 *  3. `canUndo` / `canRedo` say whether there is anywhere to go
 *  4. undo at the very beginning, or redo at the very end, is a no-op
 *  5. THE RULE THAT MAKES IT REAL: after undoing, a new `set` throws away the
 *     redo future. Undo twice, type something new, and "redo" must not
 *     resurrect the branch you abandoned. Every editor works this way.
 *  6. `reset(value)` jumps to that value and clears all history —
 *     canUndo and canRedo both go false
 *  7. every returned function has a stable identity
 *
 * Think about the shape first. One "current value" plus two stacks, or one
 * array plus an index? Both work; one of them makes rule 5 a one-liner.
 */
export function useUndoable(initial) {
  throw new Error('not implemented')
}
