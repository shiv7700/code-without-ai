/**
 * Two thumbs, and each one is the other's limit
 *
 * Topics: role=slider · clamping against a moving bound · aria-valuemin/max
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role
 *
 * Props: { value: [low, high], onChange, min = 0, max = 100, step = 1,
 *          labels = ['Minimum', 'Maximum'] }
 *
 * Rules:
 *  1. Two elements with role="slider", named by `labels`, each its own tab
 *     stop, each with aria-valuenow.
 *  2. The range each thumb reports is the range it can actually reach: the
 *     lower thumb's aria-valuemax is the higher thumb's value, and the higher
 *     thumb's aria-valuemin is the lower thumb's value.
 *  3. Arrows move by a step, PageUp and PageDown by ten, Home and End go to
 *     the far ends of what that thumb may reach.
 *  4. The thumbs may meet and may not cross. A push past the other one stops
 *     dead against it — they never swap places.
 *  5. onChange is called with the whole pair, low first.
 *  6. A move that changes nothing reports nothing.
 *  7. Controlled: `value` is the only source of truth.
 *
 * Rule 2 and rule 4 are the same sentence written twice, once for a screen
 * reader and once for a mouse. Clamp each thumb to `min` and `max` and both
 * are wrong together: the thumbs slide through each other, and the range being
 * announced was never the range on offer.
 */
export default function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  labels = ['Minimum', 'Maximum'],
}) {
  return null
}
