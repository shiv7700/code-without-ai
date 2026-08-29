/**
 * LEVEL 20 — the one thing hooks still cannot do
 *
 * Topics: class components · getDerivedStateFromError
 * Read:   https://react.dev/reference/react/Component#static-getderivedstatefromerror
 * Read:   https://react.dev/reference/react/Component#componentdidcatch
 *
 * There is no useErrorBoundary. Catching a render error requires a CLASS
 * component with getDerivedStateFromError / componentDidCatch. Every library
 * that offers you one (react-error-boundary, Next.js error.js) is wrapping
 * exactly this.
 *
 * Props: {
 *   children,
 *   fallback,        a node, OR a function (error, reset) => node
 *   onError,         optional, called with the error when one is caught
 * }
 *
 * Rules:
 *  1. no error → render children untouched
 *  2. a child that throws during render → render `fallback` instead, and the
 *     children disappear
 *  3. if `fallback` is a function, call it with (error, reset)
 *  4. `onError(error)` is called once when the error is caught
 *  5. calling `reset()` clears the error and tries rendering children again
 *  6. after a reset, a NEW error is caught again (the boundary is reusable,
 *     not one-shot)
 *
 * A try/catch around JSX will not work — by the time the JSX is evaluated
 * nothing has rendered yet. The error surfaces inside React's render, which
 * is why React has to hand it back to you through these two lifecycles.
 */
export default function ErrorBoundary() {
  throw new Error('not implemented — and this one has to be a class')
}
