/**
 * LEVEL 70 — a prop can hold JSX, not just a string
 *
 * Topics: elements as props · slots · composition
 * Read:   https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
 * Read:   https://react.dev/learn/your-ui-as-a-tree
 *
 * Rules:
 *  1. a role="dialog" wrapper holding header, body and footer slots
 *  2. `header` and `footer` are props; the body is `children`
 *  3. each slot takes anything — a string, one element, several
 *  4. a slot that was not passed leaves out its element entirely
 *  5. `children` is the only one that always renders, even when empty
 *
 * Once a slot is a prop, the caller decides the markup and you decide the
 * layout. That is the whole trade — and it is why component libraries do it.
 */
export default function Dialog() {
  return null
}
