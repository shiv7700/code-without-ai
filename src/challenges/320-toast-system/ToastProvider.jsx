/**
 * LEVEL 14 — context + a queue + timers, all at once
 *
 * Topics: context · refs for timers · cleanup on unmount
 * Read:   https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref
 * Read:   https://react.dev/learn/scaling-up-with-reducer-and-context
 *
 * Export:
 *   <ToastProvider defaultDuration={3000}>{children}</ToastProvider>
 *   useToast()  →  { toasts, show, dismiss }
 *
 *   show(message, options?)  → returns the new toast's id
 *   dismiss(id)              → removes it now
 *   toasts                   → [{ id, message }] in the order they were shown
 *
 * The provider also renders the toasts itself: a container with
 * role="status" holding one element per toast (message as text, plus a
 * button labelled "Dismiss").
 *
 * Rules:
 *  1. show() adds a toast and returns a UNIQUE id (two toasts with the same
 *     message get different ids)
 *  2. a toast auto-dismisses after `defaultDuration`, or after
 *     options.duration if given
 *  3. dismiss(id) removes it immediately, and its pending timer must not
 *     fire later and remove someone else
 *  4. several toasts can be on screen at once, oldest first
 *  5. options.duration = null means it never auto-dismisses
 *  6. unmounting the provider clears every pending timer
 *  7. useToast() outside a provider throws an Error mentioning "ToastProvider"
 *
 * Do not use Math.random() for ids — you cannot test what you cannot predict.
 * A counter in a ref is enough.
 */
export function ToastProvider({ children, defaultDuration = 3000 }) {
  return children
}

export function useToast() {
  throw new Error('not implemented')
}
