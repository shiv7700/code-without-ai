/**
 * "Copied" is a claim, and it has to be earned
 *
 * Topics: async event handlers · self-resetting state · live regions
 * Read:   https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/status_role
 *
 * Props: { text, write, resetAfter = 2000 }
 *
 * `write(text)` returns a promise. It is the clipboard, handed in so the test
 * can decide when — and whether — it succeeds.
 *
 * Rules:
 *  1. The button reads "Copy".
 *  2. Clicking calls write(text) exactly once.
 *  3. It keeps reading "Copy" until that promise settles.
 *  4. On success it reads "Copied", then goes back to "Copy" after
 *     `resetAfter` milliseconds.
 *  5. On failure it reads "Copy failed", and resets the same way.
 *  6. A role="status" region carries the outcome, and is empty while idle.
 *
 * A clipboard write is a promise and it can be refused — no permission, not a
 * secure context, the document not focused. Fire and forget, and the button
 * says "Copied" over a clipboard that still holds whatever was there before.
 * The user finds out on paste.
 */
export default function CopyButton({ text, write, resetAfter = 2000 }) {
  return null
}
