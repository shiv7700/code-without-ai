/**
 * Catching the failure, and showing what it said
 *
 * Topics: error state · catch · conditional rendering
 * Read:   https://react.dev/learn/synchronizing-with-effects
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 *
 * @param {() => Promise<{temp: number}>} load
 *
 * Rules:
 *  1. success — the temperature in [data-testid="temp"]
 *  2. failure — [role="alert"] holding the error's `message`, and no temp
 *  3. only ever one of the two on screen
 *  4. the error text is the message, not a hardcoded "Something went wrong"
 *
 * Rule 4 costs nothing now and saves the afternoon later when the real answer
 * was "rate limited, try in 30s" and the screen just said "error".
 */
export default function Weather() {
  return null
}
