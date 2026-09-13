/**
 * One string out of four props, with no room for a stray space
 *
 * Topics: derived values · template strings · optional props
 * Read:   https://react.dev/learn/passing-props-to-a-component
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
 *
 * Rules:
 *  1. the whole label renders in [data-testid="label"]
 *  2. the parts, in this order: `title`, `first`, `nickname` in double quotes,
 *     `last`
 *  3. only the parts that were given appear, separated by exactly one space
 *  4. none of them given → "Anonymous"
 *
 * Every missing prop is a chance to leak. `${title} ${first} ${last}` with no
 * title starts with a space, and with no last it ends in "undefined" — both of
 * which render happily. Decide which parts exist before you join them, not while.
 */
export default function UserLabel() {
  return null
}
