/**
 * LEVEL 85 — states and transitions, spelled out
 *
 * Topics: state machines · guards · one state object, not two
 * Read:   https://react.dev/learn/extracting-state-logic-into-a-reducer
 * Read:   https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
 *
 * @param {{initial, context?, states}} machine
 * @returns {[{value, context, matches}, send]}
 *
 * A machine looks like:
 *   {
 *     initial: 'idle',
 *     context: { retries: 0 },
 *     states: {
 *       idle:    { on: { FETCH: 'loading' } },
 *       loading: { on: { REJECT: { target: 'failure',
 *                                  action: (ctx, event) => ({ ...ctx, retries: ctx.retries + 1 }) } } },
 *       failure: { on: { RETRY: { target: 'loading',
 *                                 guard: (ctx, event) => ctx.retries < 2 } } },
 *     },
 *   }
 *
 * Rules:
 *  1. Starts at `initial` with `context` (or `{}`).
 *  2. `send('FETCH')` and `send({ type: 'FETCH', ...payload })` both work.
 *  3. An event the CURRENT state does not list is ignored. Being handled by
 *     some other state means nothing here — that is the point of a machine.
 *  4. A transition is a target string, or `{ target, action?, guard? }`.
 *  5. `action(context, event)` returns the next context. Without one, the
 *     context is untouched.
 *  6. `guard(context, event)` returning false blocks the transition entirely —
 *     no state change AND no context change.
 *  7. `matches(name)` reports the current state.
 *  8. `send` keeps its identity across renders.
 *
 * Rule 6 is why `value` and `context` belong in ONE state object. Two separate
 * `useState` calls each have to re-derive the transition, and the day the two
 * disagree you get a state change with the guard's context, or the reverse.
 */
export function useMachine(machine) {
  throw new Error('not implemented')
}
