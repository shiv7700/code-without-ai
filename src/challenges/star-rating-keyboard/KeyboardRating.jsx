/**
 * Five stars, one tab stop
 *
 * Topics: role=slider · keyboard handlers · clamping
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role
 *
 * Props: { value = 0, onChange, max = 5 }
 *
 * Rules:
 *  1. One element with role="slider", named "Rating", holding the stars.
 *  2. aria-valuemin="0", aria-valuemax={max}, aria-valuenow={value}, and
 *     aria-valuetext of "3 of 5" — "3" on its own tells nobody anything.
 *  3. It is a single tab stop. Tab lands on it, and the next Tab leaves the
 *     widget entirely.
 *  4. ArrowRight and ArrowUp add one. ArrowLeft and ArrowDown take one away.
 *     Home goes to 0, End goes to `max`.
 *  5. Every change calls onChange with the new value.
 *  6. It clamps. At 0 or at `max` the key does nothing and reports nothing.
 *  7. The stars themselves are decoration — aria-hidden, and not focusable.
 *  8. Controlled: `value` is the only source of truth.
 *
 * Rule 3 is the one that catches the obvious build. Five buttons is five stops
 * in the tab order for one answer, and a form of eight questions becomes forty
 * presses. The whole rating is one widget, so it takes one stop and the arrows
 * do the rest.
 */
export default function KeyboardRating({ value = 0, onChange, max = 5 }) {
  return null
}
