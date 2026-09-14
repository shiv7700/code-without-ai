/**
 * Gravity, and a move that did not happen
 *
 * Topics: grids as rows and columns · win detection · guarding a turn
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 *
 * @param {number} rows  default 6
 * @param {number} cols  default 7
 *
 * Render:
 *   - one button per column, "Drop in column 1" through "Drop in column 7"
 *   - rows × cols <div data-testid="cell">, top row first, each with
 *     data-player="red" or "yellow" once it is occupied
 *   - <p data-testid="status"> reading "Red's turn", "Yellow's turn" or
 *     "Red wins" / "Yellow wins"
 *
 * Rules:
 *  1. Red plays first, and the turn alternates.
 *  2. A disc lands on the lowest empty row of the column it was dropped in.
 *  3. Four of one colour in a row, a column, or either diagonal wins.
 *  4. Once someone has won, nothing more can be dropped.
 *  5. A column with no room left refuses the disc.
 *
 * Rule 5 is where it goes wrong: the click is handled, the column is found to
 * be full, the drop is abandoned — and the turn has already been handed over.
 * Yellow plays twice and nobody notices until the board is half full. Decide
 * whether a move happened before you change anything else.
 */
export default function ConnectFour({ rows = 6, cols = 7 }) {
  return null
}
