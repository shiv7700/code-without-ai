/**
 * LEVEL 32 — keyboard handling, and rejecting bad input quietly
 *
 * Topics: onKeyDown · arrays in state · controlled input
 * Read:   https://react.dev/learn/updating-arrays-in-state
 *
 * Props: { onChange }
 *
 * Render an input labelled "Tag" and the current tags. Each tag renders with
 * data-testid="tag" and a "Remove <tag>" button.
 *
 * Rules:
 *  1. Enter commits the typed text as a tag and clears the input.
 *  2. Surrounding whitespace is trimmed. Empty or whitespace-only input adds
 *     nothing and still clears.
 *  3. Duplicates are rejected — the input clears, the list does not grow.
 *  4. Backspace on an EMPTY input removes the last tag. On a non-empty input
 *     it just edits text, as normal.
 *  5. "Remove <tag>" removes that one.
 *  6. onChange fires with the new array whenever the tags change, and not
 *     when an add was rejected.
 */
export default function TagInput({ onChange }) {
  return null
}
