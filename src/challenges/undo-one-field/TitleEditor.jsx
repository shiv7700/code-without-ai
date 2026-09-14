/**
 * One step back, and only one
 *
 * Topics: capturing a value as it changes · history of one · disabled buttons
 * Read:   https://react.dev/learn/state-as-a-snapshot
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * @param {string} initial
 *
 * Render an input labelled "Title", a button "Apply", a heading showing the
 * applied title, and a button "Undo".
 *
 * Rules:
 *  1. the heading starts as `initial`
 *  2. "Apply" puts whatever is in the input into the heading
 *  3. "Undo" puts the heading back to what it showed before the last Apply
 *  4. exactly one step is remembered — after an Undo, Undo is disabled
 *  5. Undo is disabled before anything has been applied
 *  6. applying again after an Undo makes Undo work again, from the new value
 *
 * The previous value has to be taken at the instant the title changes. Keep it
 * continuously up to date instead — in an effect, or assigned while rendering —
 * and by the time Undo is pressed it has already caught up with the title on
 * screen, so the button does precisely nothing and looks like it was never
 * wired up.
 */
export default function TitleEditor({ initial = '' }) {
  return null
}
