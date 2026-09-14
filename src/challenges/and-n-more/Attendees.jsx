/**
 * The count at the end has to be right at every length
 *
 * Topics: slicing for display · boundaries · pluralisation
 * Read:   https://react.dev/learn/rendering-lists
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
 *
 * @param {string[]} names
 * @param {number} [limit=3]
 *
 * Rules:
 *  1. a <ul> with one <li> per shown name, in order, at most `limit` of them
 *  2. more names than that — a final [data-testid="more"] <li> reading
 *     "and 2 others". It is extra, not one of the `limit`
 *  3. exactly `limit` names — no more row at all. There is no "and 0 others"
 *  4. one name over — "and 1 other", singular
 *  5. `limit` of 0 shows no names and still counts correctly
 *  6. an empty list renders an empty <ul> and no more row
 *
 * Three boundaries and a one-line answer that gets two of them wrong. Off by
 * one in the subtraction and the count is short by exactly the name you are
 * hiding; take the comparison as >= instead of > and every full list ends with
 * a row apologising for nobody.
 */
export default function Attendees() {
  return null
}
