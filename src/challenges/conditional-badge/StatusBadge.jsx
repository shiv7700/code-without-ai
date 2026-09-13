/**
 * && renders its left side when that side is a number
 *
 * Topics: conditional rendering · falsy values · &&
 * Read:   https://react.dev/learn/conditional-rendering#logical-and-operator-
 * Read:   https://react.dev/learn/javascript-in-jsx-with-curly-braces
 *
 * Rules:
 *  1. `label` always renders
 *  2. a [data-testid="count"] bubble renders only when `count` is above 0
 *  3. `count={0}` — no bubble, and no stray "0" anywhere in the output
 *  4. no `count` at all — no bubble
 *  5. `urgent` adds "urgent" to the class; the base class is "badge"
 *
 * Rule 3 is the whole challenge. `{count && <b/>}` with count === 0 does not
 * render nothing — it renders 0, because that is what && hands back.
 */
export default function StatusBadge() {
  return null
}
