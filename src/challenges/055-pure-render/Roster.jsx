/**
 * LEVEL 55 — same props in, same JSX out, every single time
 *
 * Topics: purity · no mutation · rendering lists
 * Read:   https://react.dev/learn/keeping-components-pure
 * Read:   https://react.dev/learn/rendering-lists
 *
 * Rules:
 *  1. an <ol> with one <li> per name, each reading "{n}. {name}"
 *  2. numbering starts at `start`, which defaults to 1
 *  3. the `names` array you were handed comes back untouched
 *  4. rendering the same component twice gives byte-identical output
 *
 * Rule 4 fails the moment a counter lives outside the function. Anything
 * declared at module level is shared by every render of every instance.
 */
export default function Roster() {
  return null
}
