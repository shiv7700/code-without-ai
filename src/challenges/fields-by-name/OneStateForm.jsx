/**
 * One handler for four inputs, keyed by the input's own name
 *
 * Topics: object state · computed keys · one handler for many inputs
 * Read:   https://react.dev/learn/updating-objects-in-state#using-a-single-event-handler-for-multiple-fields
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
 *
 * @param {(values: object) => void} onSubmit
 *
 * Render a <form> with four controls, each carrying a `name` attribute that
 * matches its key, and a submit button labelled "Create":
 *
 *   "Name"       text      → name       ''
 *   "Email"      email     → email      ''
 *   "Role"       select    → role       'viewer', or 'admin'
 *   "Subscribe"  checkbox  → subscribe  false
 *
 * Rules:
 *  1. ONE piece of state, an object holding all four, and ONE onChange shared
 *     by every control
 *  2. the handler works out which key to write from `event.target.name`
 *  3. a checkbox reports `checked`, not `value` — `subscribe` is a boolean
 *  4. changing one control leaves the other three alone
 *  5. "Create" calls `onSubmit` with all four keys, and does not reload the page
 *
 * The checkbox is the one that gets through code review. `value` on an
 * unlabelled checkbox is the string "on" whether it is ticked or not, so the
 * form submits a truthy subscribe for someone who never ticked anything.
 */
export default function OneStateForm({ onSubmit }) {
  return null
}
