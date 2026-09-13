/**
 * Try again, but not forever
 *
 * Topics: retrying · attempt counting · async recursion
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * @param {() => Promise<string>} send
 * @param {number} retries  extra attempts after the first, default 1
 *
 * Rules:
 *  1. calls `send` once; if it resolves, show the result
 *  2. if it rejects, call it again — at most `retries` more times
 *  3. all attempts failing shows [role="alert"] with the LAST error's message
 *  4. `retries={0}` means one attempt and no more
 *  5. a retry that succeeds shows the result, and stops there
 *
 * The count is the whole exercise. An off-by-one here is the difference
 * between one extra attempt and hammering a service that is already down.
 */
export default function Upload() {
  return null
}
