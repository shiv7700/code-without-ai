/**
 * LEVEL 29 — async in a hook, plus a flag that resets itself
 *
 * Topics: async handlers · setTimeout in a hook · cleanup on unmount
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {number} resetAfter  milliseconds, default 2000
 * @returns {[boolean, Function]}  [copied, copy]
 *
 * `copy(text)` writes to navigator.clipboard and flips `copied` to true.
 *
 * Rules:
 *  1. `copied` starts false.
 *  2. After a successful copy it is true, then falls back to false once
 *     `resetAfter` has passed.
 *  3. Copying again restarts the window — it does not reset early because of
 *     the first copy's timer.
 *  4. If the write REJECTS, `copied` stays false and nothing throws.
 *  5. `copy` has a stable identity across re-renders.
 *  6. Unmounting cancels a pending reset.
 */
export function useClipboard(resetAfter = 2000) {
  throw new Error('not implemented')
}
