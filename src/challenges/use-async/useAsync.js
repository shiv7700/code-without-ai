/**
 * Run it when I say, and tell me which of the three things is happening
 *
 * Topics: async state · races · setting state after unmount
 * Read:   https://react.dev/learn/you-might-not-need-an-effect#fetching-data
 * Read:   https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref
 *
 * @param {(...args) => Promise<*>} asyncFn  a fresh arrow every render
 * @returns {{status: 'idle'|'pending'|'success'|'error', data, error, run}}
 *
 * Rules:
 *  1. before anything is asked for: status 'idle', data and error both null
 *  2. `run(...args)` passes its arguments straight through, goes to 'pending',
 *     and settles on 'success' with `data`, or 'error' with `error`
 *  3. `run` never rejects — the error is the state, not an exception the caller
 *     has to catch as well
 *  4. `run` has the same identity on every render, and always calls the
 *     `asyncFn` from the latest render
 *  5. two runs overlapping: only the LATEST one may set state, whichever of
 *     them answers first
 *  6. a run that settles after unmount changes nothing and throws nothing
 *
 * Rule 5 is not the same as rule 6, and it is the one that survives review.
 * Click twice, and if the first request is slower you end up showing the first
 * answer for the second question, with 'success' on it and no way to tell.
 * Rule 4 is what stops you solving 5 by rebuilding `run` every render.
 */
export function useAsync(asyncFn) {
  throw new Error('not implemented')
}
