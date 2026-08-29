/**
 * LEVEL 23 — hover preview without losing the committed value
 *
 * Topics: two pieces of state · pointer events · aria-label
 * Read:   https://react.dev/learn/responding-to-events
 *
 * Props: { value = 0, onRate }
 *
 * Render five buttons, aria-label "Rate 1" through "Rate 5".
 *
 * Rules:
 *  1. Buttons 1..value carry data-filled="true". The rest must not have the
 *     attribute at all.
 *  2. Clicking button n calls onRate(n). Exactly once.
 *  3. Hovering button n previews n filled stars WITHOUT calling onRate.
 *  4. Moving the pointer off a star drops the preview and shows `value` again.
 *
 * The preview is separate state from the committed value. Rendering reads
 * "preview ?? value" — one line, and rule 4 falls out for free.
 */
export default function StarRating({ value = 0, onRate }) {
  return null
}
