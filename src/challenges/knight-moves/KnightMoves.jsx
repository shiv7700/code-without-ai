/**
 * The board is eight by eight, not sixty-four in a row
 *
 * Topics: grids as rows and columns · bounds checking · derived highlighting
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 *
 * Render:
 *   64 buttons, one per square, each aria-labelled with its name — "a1" to
 *   "h8". a8 is the first in the DOM and h1 the last, so rank 8 is at the top
 *   and the a file on the left.
 *
 * Rules:
 *  1. Nothing is marked until a square is clicked.
 *  2. The square clicked gets data-knight="true".
 *  3. Every square a knight there could reach in one move gets
 *     data-move="true" — two along one way and one along the other.
 *  4. The square the knight stands on is not one of its moves.
 *  5. Clicking elsewhere moves the knight and clears what was marked before.
 *
 * A knight on h1 has exactly two moves. Treat the board as one long list and
 * add the eight offsets to an index and it grows a few more — the ones that
 * ran off the right-hand edge and came back on the left, a rank up. Squares
 * have two coordinates and both of them have to stay on the board.
 */
export default function KnightMoves() {
  return null
}
