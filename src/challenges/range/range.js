/**
 * The numbers from here to there
 *
 * Topics: default arguments · loop conditions · infinite loops
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
 *
 * @param {number} start  the only argument when called with one — then it is the end
 * @param {number} [end]
 * @param {number} [step]
 * @returns {number[]}
 *
 * Rules:
 *  1. `range(4)` is `range(0, 4)`.
 *  2. `end` is never included.
 *  3. With no `step`, count up by one — unless `end` is below `start`, in which
 *     case count down by one.
 *  4. A step that points away from `end` produces nothing. It is not an error.
 *  5. A step of `0` returns an empty array. It must not loop forever.
 *
 * Rules 4 and 5 are why this is not a one-liner. One loop condition cannot
 * serve both directions — `i < end` runs forever counting down, `i !== end`
 * runs forever the moment the step overshoots. The sign of the step has to
 * decide which comparison you are making.
 */
export function range(start, end, step) {
  throw new Error('not implemented')
}
