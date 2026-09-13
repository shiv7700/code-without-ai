/**
 * LEVEL 62 — a checkbox that is neither on nor off
 *
 * Topics: recursive trees · the indeterminate property · derived state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/indeterminate
 * Read:   https://react.dev/reference/react-dom/components/common#ref-callback
 *
 * Props: { tree: [{ id, name, children? }] }
 *
 * Render:
 *   every node as a checkbox LABELLED with its name, children nested under it.
 *
 * Rules:
 *  1. Everything starts unchecked.
 *  2. Checking a node checks every descendant. Unchecking clears them.
 *  3. A node whose descendants are ALL checked is checked.
 *  4. A node with some but not all checked is `indeterminate` — which is a DOM
 *     property, not an attribute, so it cannot be set in JSX. A ref callback
 *     sets it.
 *  5. That state travels all the way up, not just one level.
 *  6. A leaf is never indeterminate.
 *
 * Rule 3 says a parent's checked state is DERIVED from its leaves, not stored.
 * Store the checked leaves; compute every branch during render. Store a flag
 * per node instead and you own the job of keeping them all in sync.
 */
export default function NestedCheckboxes({ tree }) {
  return null
}
