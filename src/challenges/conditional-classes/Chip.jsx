/**
 * Building a class string without a library
 *
 * Topics: derived strings · falsy values · template literals
 * Read:   https://react.dev/reference/react-dom/components/common#applying-css-styles
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 *
 * Rules:
 *  1. always "chip"
 *  2. `selected` adds "chip--selected"
 *  3. `size` adds "chip--{size}" — skipped entirely when there is no size
 *  4. the caller's `className` goes last
 *  5. single spaces only, and no space at either end
 *
 * Rule 5 is the one that string concatenation loses. Build a list, drop the
 * falsy entries, join it once.
 */
export default function Chip() {
  return null
}
