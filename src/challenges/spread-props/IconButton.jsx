/**
 * Take what you need, pass the rest down
 *
 * Topics: rest props · spread · className merging
 * Read:   https://react.dev/learn/passing-props-to-a-component#forwarding-props-with-the-jsx-spread-syntax
 * Read:   https://react.dev/reference/react-dom/components/common
 *
 * Rules:
 *  1. renders a <button> whose accessible name is `label`
 *  2. `icon` is the visible content
 *  3. every other prop lands on the <button> — type, disabled, onClick, data-*
 *  4. class is "icon-button", plus the caller's `className` after it when given
 *  5. no className — the class is exactly "icon-button", no trailing space
 *
 * A wrapper that only accepts the props it thought of is a wrapper people stop
 * using. Name the few you consume, spread the rest.
 */
export default function IconButton() {
  return null
}
