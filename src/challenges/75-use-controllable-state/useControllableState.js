/**
 * LEVEL 75 — the hook behind every component library
 *
 * Topics: controlled vs uncontrolled · refs for latest values · stable setters
 * Read:   https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components
 * Read:   https://react.dev/reference/react/useRef
 *
 * @param {{value?, defaultValue?, onChange?}} props
 * @returns {[current, setValue]}
 *
 * Rules:
 *  1. If `value` is `undefined`, the hook is UNCONTROLLED: it owns the state,
 *     starting from `defaultValue`, and `setValue` updates it.
 *  2. Otherwise it is CONTROLLED: `value` is what comes back, always, and
 *     `setValue` does NOT change it. Only a new prop does.
 *  3. `onChange` is called with the next value in BOTH modes. In controlled
 *     mode it is the only way the parent finds out.
 *  4. `setValue` accepts an updater function, resolved against the current
 *     value — the prop when controlled, the internal state when not.
 *  5. `null` is a value. Only `undefined` means uncontrolled.
 *  6. `setValue` keeps the same identity across renders.
 *
 * Rules 4 and 6 pull against each other: the setter must see the latest value
 * without listing it as a dependency. A ref updated on every render is the way
 * out — the same trick as the stale closure in level 06, used deliberately.
 */
export function useControllableState({ value, defaultValue, onChange }) {
  throw new Error('not implemented')
}
