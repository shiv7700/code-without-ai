/**
 * One click, and the board opens up as far as it safely can
 *
 * Topics: flood fill · a visited set · derived win condition
 * Read:   https://en.wikipedia.org/wiki/Flood_fill
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
 *
 * @param {string[]} board  one string per row, '*' for a mine, '.' for empty
 *
 * Render:
 *   one button per square, aria-labelled "1,2" (row, column, counting from 0),
 *   with data-state="hidden" or "open". An open square shows the number of
 *   mines touching it, nothing at all if that number is zero, and "*" if it is
 *   a mine. Also <p data-testid="status"> reading "Playing", "Boom" or
 *   "Cleared".
 *
 * Rules:
 *  1. A square touches the eight around it, diagonals included.
 *  2. Clicking a numbered square opens only that square.
 *  3. Clicking a square touching no mines opens it and keeps going — every
 *     empty neighbour opens too, and so on outwards. Numbered squares on the
 *     edge of that area are opened but the spread does not carry on through
 *     them.
 *  4. Clicking a mine shows every mine and ends the game. Nothing responds
 *     after that.
 *  5. Opening every square that is not a mine is "Cleared".
 *
 * Rule 3 is two mistakes in one. Carry on through the numbers and the first
 * click opens the entire board. Forget to write a square down before you go
 * looking at its neighbours and two adjacent empties send each other back and
 * forth until the stack gives out.
 */
export default function Minesweeper({ board }) {
  return null
}
