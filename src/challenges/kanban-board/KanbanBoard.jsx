/**
 * The card moves, and the keyboard has to go with it
 *
 * Topics: nested array updates · refs by id · focus after a remount
 * Read:   https://react.dev/learn/updating-arrays-in-state#updating-objects-inside-arrays
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs
 *
 * Props: { columns: [{ id, title, cards: [{ id, text }] }] }
 *
 * Render:
 *   - <section data-testid="column-todo"> per column, holding its title
 *   - one <li data-testid="card"> per card, containing a <button> labelled with
 *     the card's text, plus buttons "Move Fix bug left" and "Move Fix bug right"
 *
 * Rules:
 *  1. Moving takes the card out of its column and puts it at the END of the
 *     neighbouring one.
 *  2. "left" on the first column and "right" on the last are disabled.
 *  3. ArrowLeft and ArrowRight on a focused card do the same thing as those
 *     buttons.
 *  4. An emptied column stays on the board.
 *  5. After any move, the card that moved holds focus — so a second arrow press
 *     moves it again.
 *
 * Rule 5 is the one that bites. The card is not moved on screen, it is
 * destroyed in one column and built again in another, and the browser does not
 * carry focus across that. The keyboard lands on the body and the next press
 * goes nowhere — which is why the last test presses twice.
 */
export default function KanbanBoard({ columns }) {
  return null
}
