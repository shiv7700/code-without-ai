/**
 * Rows into columns, and back
 *
 * Topics: rest args · ragged input · Math.max
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
 *
 * @param {...Array} lists
 * @returns {Array[]} one row per index
 *
 * Rules:
 *  1. `zip` takes any number of lists and returns one row per index.
 *  2. The result is as long as the LONGEST input. Missing cells are `undefined`.
 *  3. `zip()` with nothing at all returns an empty array.
 *  4. `unzip` is the inverse: it takes the rows and gives back the columns,
 *     padding short rows the same way.
 *  5. Nothing passed in is modified.
 *
 * Rule 2 is the decision the five-line version makes without noticing. Reading
 * `lists[0].length` quietly truncates when a later list is longer, and that is
 * data silently dropped rather than a crash. Rule 3 then catches the fix:
 * `Math.max(...[])` is `-Infinity`, not `0`. Once `zip` is right, `unzip` is
 * one line that calls it.
 */
export function zip(...lists) {
  throw new Error('not implemented')
}

export function unzip(rows) {
  throw new Error('not implemented')
}
