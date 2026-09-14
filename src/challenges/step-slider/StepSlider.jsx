/**
 * A slider is arithmetic, and the arithmetic is the hard part
 *
 * Topics: role=slider · clamping · floating point
 * Read:   https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
 *
 * Props: { value, onChange, min = 0, max = 100, step = 1, label = 'Volume' }
 *
 * Rules:
 *  1. One element with role="slider", named `label`, in the tab order once.
 *  2. aria-valuemin, aria-valuemax and aria-valuenow say where it is.
 *  3. ArrowRight and ArrowUp add a step, ArrowLeft and ArrowDown take one away.
 *  4. PageUp and PageDown move ten steps at once.
 *  5. Home goes to `min`, End goes to `max`.
 *  6. Everything clamps to the range, and a key that cannot move it reports
 *     nothing at all.
 *  7. Reported values are exact to the precision of `step`. With step 0.1, two
 *     tenths and one more press is three tenths — and it is 0.3 on the way to
 *     the parent as well as on the screen.
 *  8. Controlled: `value` is the only source of truth.
 *
 * Rule 7 is not pedantry. A decimal step means the value drifts a little
 * further from the truth on every press, and the number that eventually
 * reaches your API has a tail of digits nobody typed. Deciding where the
 * rounding happens, once, is the whole job.
 */
export default function StepSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label = 'Volume',
}) {
  return null
}
