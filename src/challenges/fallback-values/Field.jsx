/**
 * ?? and || disagree about 0 and ""
 *
 * Topics: nullish coalescing · falsy values · default props
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing
 * Read:   https://react.dev/learn/conditional-rendering
 *
 * Rules:
 *  1. `label` in [data-testid="label"], the value in [data-testid="value"]
 *  2. a value that was given is shown as it is — including 0 and ""
 *  3. only undefined or null falls back to `placeholder`
 *  4. `placeholder` defaults to "—"
 *
 * `value || placeholder` passes four of these tests and fails the two that
 * matter. A quantity of 0 and an empty note are answers, not missing data.
 */
export default function Field() {
  return null
}
