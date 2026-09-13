/**
 * The one case where only the updater form survives
 *
 * Topics: stale closure · updater form · deferred callbacks
 * Read:   https://react.dev/learn/queueing-a-series-of-state-updates
 * Read:   https://react.dev/learn/state-as-a-snapshot
 *
 * @param {(run: () => void) => void} schedule  runs the callback later — much
 *   later, and whoever owns `schedule` decides when
 *
 * Render the count in [data-testid="count"], starting at 0, and two buttons:
 * "+1 later" and "+5 later".
 *
 * Rules:
 *  1. clicking changes nothing on screen — it hands `schedule` one callback,
 *     and exactly one
 *  2. when that callback eventually runs, the count goes up by that button's
 *     amount
 *  3. clicks made before any callback has run all count — three "+1 later"
 *     clicks, then three callbacks, is 3
 *  4. the two buttons mix freely, in any order
 *
 * A callback written the obvious way captures `count` from the render the click
 * happened in. Click three times and all three callbacks are holding the same
 * frozen 0, so they each set the count to 1 — three times, in a row, correctly,
 * and wrongly.
 */
export default function DelayedCounter({ schedule }) {
  return null
}
