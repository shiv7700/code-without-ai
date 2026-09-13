/**
 * Asking again, without a second copy of the fetching code
 *
 * Topics: useCallback · manual refetch · effect + event sharing one function
 * Read:   https://react.dev/reference/react/useCallback
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * @param {() => Promise<number>} load
 *
 * Rules:
 *  1. loads once on mount and shows the price
 *  2. "Refresh" calls `load` again and shows the new price
 *  3. while a refresh is in flight, [data-testid="spinner"] is up again
 *  4. two refreshes means three calls in total, never more
 *
 * Rule 4 catches the usual fix, which is to duplicate the request — once in
 * the effect and once in the handler. One function, called from both.
 */
export default function Prices() {
  return null
}
