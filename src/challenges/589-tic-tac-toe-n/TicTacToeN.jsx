/**
 * LEVEL 88 — any board size, any run length, and time travel
 *
 * Topics: generalised win detection · history as state · dropping the future
 * Read:   https://react.dev/learn/tic-tac-toe#adding-time-travel
 * Read:   https://react.dev/learn/updating-arrays-in-state
 *
 * Props: { size, inARow }  — a size×size board, `inARow` to win
 *
 * Render:
 *   - <p data-testid="status">, reading "X to play", "X wins" or "Draw"
 *   - a role="grid" of buttons labelled "Cell 0,0" … "Cell 3,3", row first,
 *     zero-based
 *   - an <ol> of history buttons: "Go to start", "Go to move 1", …
 *
 * Rules:
 *  1. X first, turns alternate, a taken square does nothing.
 *  2. A win is `inARow` of the same mark consecutively, horizontally,
 *     vertically or on EITHER diagonal — starting anywhere on the board, not
 *     just at an edge.
 *  3. A run must not wrap around the edge of the board.
 *  4. There is one history button per position, including the empty start.
 *  5. Jumping restores that board AND whose turn it was.
 *  6. Playing after a jump DROPS the abandoned future. The history ends at the
 *     new move.
 *  7. Once won, no more moves.
 *
 * Level 61's hard-coded list of eight winning lines does not survive a 15×15
 * board. Walk from each square in four directions instead — four, not eight,
 * because a run found going right is the same run found going left.
 *
 * Rule 6 is level 19's undo/redo, arriving from a completely different door.
 */
export default function TicTacToeN({ size, inARow }) {
  return null
}
