/**
 * State read inside a handler is a photograph, not a live feed
 *
 * Topics: state as a snapshot · updater form · batching
 * Read:   https://react.dev/learn/state-as-a-snapshot
 * Read:   https://react.dev/learn/queueing-a-series-of-state-updates
 *
 * @param {number[]} steps
 *
 * Render the total in [data-testid="total"], starting at 0, one button per
 * step labelled "+3" for a step of 3, and one more labelled "Apply all".
 *
 * Rules:
 *  1. a step button adds its own step to the total
 *  2. "Apply all" adds every step, in one click — [1, 2, 3] takes 0 to 6
 *  3. a step that appears twice counts twice
 *  4. both work again on the second click, from wherever the total now is
 *
 * "Apply all" is a loop over the steps, not a sum worked out up front. Written
 * the obvious way, all four passes read the same `total` — the one from the
 * render the click started in — and the last one silently wins.
 */
export default function StepCounter({ steps = [] }) {
  return null
}
