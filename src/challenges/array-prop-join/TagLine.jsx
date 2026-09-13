/**
 * An array dropped into JSX renders with nothing in between
 *
 * Topics: arrays in JSX · join · lists
 * Read:   https://react.dev/learn/javascript-in-jsx-with-curly-braces
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join
 *
 * @param {string[]} tags
 *
 * Rules:
 *  1. [data-testid="summary"] reads the tags separated by ", "
 *  2. below it a <ul> holds one <li> per tag, in order
 *  3. no tags at all: the summary reads "none" and there is no <ul>
 *
 * Rule 1 is where it bites. `{tags}` renders "redbluegreen" — React did join
 * the array for you, just not with anything between the items. One of these two
 * outputs wants a string and the other wants elements; they are not the same job.
 */
export default function TagLine() {
  return null
}
