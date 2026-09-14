/**
 * An empty alt and a missing alt are opposite instructions
 *
 * Topics: images · alt text · accessibility tree
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#alt
 * Read:   https://react.dev/reference/react-dom/components/common
 *
 * @param {string} src
 * @param {string} [alt]
 * @param {boolean} [decorative]
 *
 * Rules:
 *  1. an <img> with that `src`, and `width` and `height` on the element —
 *     160 and 90 unless given, so the layout does not jump when it loads
 *  2. `alt` becomes the image's accessible name
 *  3. `decorative` forces the alt to the empty string, whatever `alt` says
 *  4. an empty alt means the image is not in the accessibility tree at all —
 *     it has no role and no name, and the spec checks by looking for it
 *  5. the alt attribute is written even when there is no `alt` prop
 *
 * Rule 5 is the one React makes easy to get wrong. `alt={alt}` with nothing
 * passed writes no attribute at all, and an img with no alt is not skipped —
 * a screen reader falls back to reading the file name out of the URL. Empty
 * says "there is nothing here worth describing". Absent says "somebody forgot".
 */
export default function Thumbnail() {
  return null
}
