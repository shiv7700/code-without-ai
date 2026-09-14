/**
 * A calculator that waits until you press equals
 *
 * Topics: operator precedence · expression state · repeated equals
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
 * Read:   https://react.dev/learn/choosing-the-state-structure
 *
 * Render:
 *   buttons "0" to "9", "+", "-", "*", "/", "=" and "C", and an element
 *   data-testid="display".
 *
 * Rules:
 *  1. Digits build the number on the display; it starts at "0".
 *  2. An operator ends the number but changes nothing on the display.
 *  3. "=" works out the whole expression at once. × and ÷ bind tighter than
 *     + and −; equal ranks go left to right.
 *  4. "=" pressed again applies the last operator and the number after it to
 *     the result, over and over: 2 + 3 = 5, = 8, = 11.
 *  5. "C" puts everything back to "0".
 *
 * Almost every calculator written from memory folds the running total on every
 * operator press, which answers 20 to 2 + 3 × 4 and cannot answer rule 4 at
 * all. Keep what was typed, not what it comes to so far.
 */
export default function Calculator() {
  return null
}
