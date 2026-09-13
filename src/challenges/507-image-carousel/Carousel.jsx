/**
 * LEVEL 58 — next, previous, and wrapping around
 *
 * Topics: index state · modulo arithmetic · aria-current
 * Read:   https://react.dev/learn/updating-arrays-in-state
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
 *
 * Props: { images: [{ src, alt }] }
 *
 * Render:
 *   - a button labelled "Previous" and one labelled "Next"
 *   - ONE <img> — the current image, with its own src and alt
 *   - <span data-testid="position"> reading "2 / 3", one-based
 *   - one dot button per image, labelled "Go to slide 1", "Go to slide 2", …
 *
 * Rules:
 *  1. Starts on the first image.
 *  2. Only the current image is in the DOM. Not hidden — absent.
 *  3. Next past the last one wraps to the first. Previous before the first
 *     wraps to the last.
 *  4. A dot jumps straight to its image.
 *  5. The current dot carries aria-current={true}, and it is the only one.
 *
 * Rule 3 is `(i + 1) % length` forwards. Backwards, `(i - 1) % length` gives
 * you -1, and `images[-1]` is undefined — add the length before taking the
 * remainder.
 */
export default function Carousel({ images }) {
  return null
}
