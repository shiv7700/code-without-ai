/**
 * An effect that sits out the first render
 *
 * Topics: useEffect · useRef as a flag · state that costs a render
 * Read:   https://react.dev/reference/react/useEffect
 * Read:   https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref
 *
 * @param {() => (void | Function)} effect  may return a cleanup, as usual
 * @param {Array} deps
 *
 * Rules:
 *  1. it does not run on mount, whatever the deps are
 *  2. it runs when a dependency changes, and only then
 *  3. a re-render with unchanged deps does not run it
 *  4. the cleanup behaves normally: before the next run, and on unmount
 *  5. a run that was skipped leaves no cleanup behind to run later
 *  6. the hook costs the component no extra render — mounting renders once
 *
 * Rule 6 is the one that catches the obvious answer. "Have I rendered before"
 * feels like state, so it gets stored as state, and now setting it schedules a
 * second render of everything below — on mount, for every component using the
 * hook. You need somewhere to keep a value that rendering can read and writing
 * cannot be noticed.
 */
export function useUpdateEffect(effect, deps) {
  throw new Error('not implemented')
}
