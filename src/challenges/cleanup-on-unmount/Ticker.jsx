/**
 * Answering a component that is no longer there
 *
 * Topics: effect cleanup · unmount · setting state after unmount
 * Read:   https://react.dev/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed
 * Read:   https://react.dev/reference/react/useEffect#connecting-to-an-external-system
 *
 * @param {() => Promise<number>} load
 * @param {(value: number) => void} onValue  called only while still mounted
 *
 * Rules:
 *  1. shows the value once it arrives, and calls `onValue` with it
 *  2. after unmount, a response that lands late is dropped entirely
 *  3. so `onValue` is never called once the component is gone
 *  4. a late rejection after unmount is swallowed too
 *
 * You cannot cancel a promise. What you can do is decide, on the way out, that
 * whatever it says no longer matters.
 */
export default function Ticker() {
  return null
}
