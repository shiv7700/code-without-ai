/**
 * LEVEL 90 — a router in twenty lines
 *
 * Topics: the History API · popstate · sharing state between hook instances
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event
 *
 * @returns {{path, push, replace}}
 *
 * Rules:
 *  1. `path` starts as `window.location.pathname`.
 *  2. `push(next)` adds a history entry and updates `path`.
 *  3. `replace(next)` changes the current entry without adding one.
 *  4. Pressing Back fires `popstate`, and `path` follows — including for
 *     navigations this hook did not cause.
 *  5. `push` and `replace` keep their identity across renders.
 *  6. The `popstate` listener is removed on unmount.
 *  7. TWO components using the hook stay in step. One calling `push` updates
 *     the other.
 *
 * Rule 7 is the sting. `pushState` fires no event — that is the whole reason
 * every router ships its own. Each `useState` is private, so a push has to
 * tell the other instances itself: a module-level set of subscribers, added to
 * on mount and removed on unmount.
 *
 * Which is level 46's emitter and level 81's external store, one last time.
 */
export function useRouter() {
  throw new Error('not implemented')
}
