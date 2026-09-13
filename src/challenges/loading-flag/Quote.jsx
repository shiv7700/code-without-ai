/**
 * The loader has to come down on the failure path too
 *
 * Topics: loading state · try/finally · async in effects
 * Read:   https://react.dev/learn/synchronizing-with-effects
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
 *
 * @param {() => Promise<string>} load
 *
 * Rules:
 *  1. [data-testid="spinner"] is there from the very first render
 *  2. it goes away when the promise resolves, and the quote is shown
 *  3. it goes away when the promise REJECTS too
 *  4. a rejection must not leave an unhandled promise behind
 *
 * Rule 3 is the one that ships broken. Turning the flag off after the await
 * only runs when nothing threw, so one failed request spins forever.
 */
export default function Quote() {
  return null
}
