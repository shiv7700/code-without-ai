/**
 * The style prop takes an object, and the units are your problem
 *
 * Topics: style prop · inline styles · camelCase
 * Read:   https://react.dev/reference/react-dom/components/common#applying-css-styles
 * Read:   https://react.dev/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx
 *
 * Rules:
 *  1. a [data-testid="track"] wrapping a [data-testid="fill"]
 *  2. the fill's inline width is `percent` as a percentage — 40 gives "40%"
 *  3. the track's inline height is `height`, a number of pixels, default 8
 *  4. the track's inline borderRadius is half the height
 *  5. `percent` below 0 or above 100 is clamped to the ends
 *
 * Two of those three numbers need a unit written on and one does not, which is
 * the whole point: React appends "px" to a bare number, so `width: percent` is
 * 40px rather than 40%. A CSS string like "width: 40%" is not an object at all,
 * and the property names in the object are not the ones you type in a stylesheet.
 */
export default function Meter() {
  return null
}
