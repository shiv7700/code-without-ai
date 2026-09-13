/**
 * A prop that was left off is not a prop that is false
 *
 * Topics: boolean props · undefined vs false · JSX shorthand
 * Read:   https://react.dev/learn/passing-props-to-a-component
 * Read:   https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 *
 * Rules:
 *  1. `name` renders in [data-testid="name"]
 *  2. [data-testid="state"] reads "yes" when `allowed` is true, "no" when false
 *  3. `allowed` left off entirely reads "inherited" — nothing was decided here
 *  4. `<PermissionRow allowed />` means the same as `allowed={true}`
 *  5. any other value actually passed — 0, "" — counts as decided, so "no"
 *
 * Rules 3 and 5 pull in opposite directions. `allowed ? 'yes' : 'no'` cannot
 * tell "not set" from "set to false", and `!allowed` cannot tell "not set"
 * from 0. Only one of those two questions is about truthiness.
 */
export default function PermissionRow() {
  return null
}
