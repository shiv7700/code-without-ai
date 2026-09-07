/**
 * LEVEL 61 — the whole game in one array
 *
 * Topics: derived state · immutable array updates · guard clauses
 * Read:   https://react.dev/learn/tic-tac-toe
 * Read:   https://react.dev/learn/updating-arrays-in-state
 *
 * Render:
 *   - <p data-testid="status">
 *   - nine buttons, labelled "Cell 1" … "Cell 9", reading left-to-right,
 *     top-to-bottom. Each shows "X", "O" or nothing.
 *   - a button labelled "Reset"
 *
 * Rules:
 *  1. X plays first, then turns alternate.
 *  2. Clicking a taken square does nothing at all — not even a turn change.
 *  3. Status reads "X to play" / "O to play", "X wins" / "O wins", or "Draw".
 *  4. A win is three in a row across, down or diagonally.
 *  5. Once won, no further moves are accepted. A full board with no line is a
 *     draw.
 *  6. Reset clears the board and gives the move back to X.
 *
 * The winner is NOT state. It is a function of the board, worked out during
 * render. Store the nine squares and whose turn it is; everything else follows.
 */
export default function TicTacToe() {
  return null
}
