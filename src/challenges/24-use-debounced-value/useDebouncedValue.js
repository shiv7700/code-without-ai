/**
 * LEVEL 24 — a value that lags behind on purpose
 *
 * Topics: useEffect cleanup · timers · why the cleanup is the whole trick
 * Read:   https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 *
 * @param {*} value
 * @param {number} delay  milliseconds
 * @returns {*} the value, but only after it has held still for `delay`
 *
 * Rules:
 *  1. On first render it returns `value` straight away — no waiting.
 *  2. After `value` changes, the OLD value keeps coming back until `delay`
 *     has passed with no further change.
 *  3. Changes faster than `delay` collapse: only the last one lands.
 *  4. Unmounting cancels a pending update. No setState after unmount.
 *
 * Rule 3 is not extra code — it is what the effect's cleanup already does,
 * as long as you clear the old timer before starting a new one.
 */
export function useDebouncedValue(value, delay) {
  throw new Error('not implemented')
}
