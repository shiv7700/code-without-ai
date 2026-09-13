/**
 * Rendering on purpose, when there is honestly no state to change
 *
 * Topics: useReducer · bailing out of a re-render · stable identity
 * Read:   https://react.dev/reference/react/useState#setstate-caveats
 * Read:   https://react.dev/reference/react/useReducer
 *
 * @returns {Function} call it, get a render
 *
 * Rules:
 *  1. calling it re-renders the component holding the hook
 *  2. three calls, one after another, give three renders — not one and then
 *     silence
 *  3. it keeps its identity across re-renders
 *  4. mounting costs exactly one render — the hook schedules nothing by itself
 *
 * React throws away a state update that sets the value already in there. Rule 2
 * exists because the obvious version satisfies rule 1 once, then goes quiet
 * forever, and nothing warns you about it.
 *
 * (Worth knowing when it is legitimate: a value living outside React that you
 * have just mutated on purpose — a ref, a mutable cache. Reaching for it to
 * paper over state you should have declared is the other thing.)
 */
export function useForceUpdate() {
  throw new Error('not implemented')
}
