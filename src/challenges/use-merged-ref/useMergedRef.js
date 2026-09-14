/**
 * One ref slot, several people who want what is in it
 *
 * Topics: ref callbacks · forwarded refs · useCallback identity
 * Read:   https://react.dev/reference/react-dom/components/common#ref-callback
 * Read:   https://react.dev/reference/react/useCallback
 *
 * @param {...(Function|{current}|null|undefined)} refs
 * @returns {Function} one ref callback to put on the element
 *
 * Rules:
 *  1. when the element attaches, every ref given gets the node — object refs by
 *     writing `current`, function refs by being called with it
 *  2. `null` and `undefined` entries are skipped, not crashed on
 *  3. when the element goes away, every ref is emptied the same way
 *  4. handing in a different ref clears the old one and fills the new
 *  5. a re-render with the same refs hands back the SAME callback
 *
 * Rule 5 is not tidiness. React compares ref callbacks by identity: a new one
 * every render means React detaches the node from the old callback — calling it
 * with `null` — and attaches it to the new one, on every render. Everything
 * still ends up holding the node, so nothing looks wrong, while any code that
 * reacts to the ref being filled runs over and over.
 */
export function useMergedRef(...refs) {
  throw new Error('not implemented')
}
