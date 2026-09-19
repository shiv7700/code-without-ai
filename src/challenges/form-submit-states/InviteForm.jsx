/**
 * A submit that can fail, and a form that survives it
 *
 * Topics: async submit · in-flight guard · keeping input on failure
 * Read:   https://react.dev/reference/react-dom/components/form
 * Read:   https://react.dev/learn/reacting-to-input-with-state
 *
 * Rules:
 *  1. takes `onSubmit` — an async function given the email
 *  2. an "Email" box and a button reading "Send"
 *  3. in flight the button is disabled and reads "Sending…"
 *  4. it worked: the box empties and "Invite sent" appears
 *  5. it failed: the typed value stays, the error's message shows, button works again
 *  6. a second click while the first is in flight does nothing
 *
 * The failing case is the one people get wrong. Clearing the box before the
 * answer arrives loses what someone typed when the network says no — so mind
 * the order of what you do and when.
 */
export default function InviteForm() {
  return null
}
