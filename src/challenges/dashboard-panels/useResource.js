/**
 * The waiting, once, so three panels do not write it three times
 *
 * Topics: useEffect · async state · unmount guard
 *
 * Rules:
 *  1. takes a function returning a promise, starts it on mount
 *  2. returns the state of that one request
 *  3. never sets state after the caller has gone
 *
 * Its shape is yours to choose — `Overview.jsx` is the only thing reading it,
 * and the spec never looks in here. What the spec does check is how many times
 * the function is called, so mind what the effect depends on.
 */
export default function useResource() {}
