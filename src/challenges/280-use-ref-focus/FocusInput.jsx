/**
 * LEVEL 21 — useRef, for reaching a DOM node
 *
 * Topics: useRef · DOM refs · focus management
 * Read:   https://react.dev/reference/react/useRef
 * Read:   https://react.dev/learn/manipulating-the-dom-with-refs
 *
 * Props: { label, autoFocus }
 *
 * Render a <label> tied to an <input>, plus two buttons: "Focus" and "Clear".
 *
 * Rules:
 *  1. The input is controlled — its value comes from state.
 *  2. Clicking "Focus" moves focus to the input.
 *  3. Clicking "Clear" empties it AND leaves it focused.
 *  4. With autoFocus, the input is focused on mount. Without it, nothing is.
 *
 * A ref is not state. Changing ref.current does not re-render, which is
 * exactly why it is the right tool for "reach out and focus that node".
 */
export default function FocusInput({ label, autoFocus }) {
  return null
}
