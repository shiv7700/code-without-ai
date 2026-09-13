/**
 * LEVEL 34 — the stale closure, one more time
 *
 * Topics: refs for handlers · effect cleanup · why the dep array lies to you
 * Read:   https://react.dev/learn/separating-events-from-effects
 *
 * @param {string} type     e.g. "keydown"
 * @param {Function} handler
 * @param {EventTarget} target  defaults to window
 *
 * Rules:
 *  1. Attaches on mount, removes on unmount.
 *  2. Always calls the LATEST handler, even when the caller passes a fresh
 *     inline arrow on every render.
 *  3. Re-rendering with a new inline handler must NOT detach and reattach.
 *     One addEventListener for the component's whole life.
 *  4. Changing `type` or `target` DOES resubscribe — off the old one, on the
 *     new one.
 *
 * Rules 2 and 3 pull in opposite directions. Put the handler in the dep array
 * and you satisfy 2 but break 3. Leave it out and you break 2. The way out is
 * a ref that you keep pointing at the newest handler, with the effect reading
 * it at call time.
 */
export function useEventListener(type, handler, target) {
  throw new Error('not implemented')
}
