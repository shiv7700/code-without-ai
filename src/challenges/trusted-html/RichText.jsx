/**
 * Turning the escaping off, and what you sign up for by doing it
 *
 * Topics: dangerouslySetInnerHTML · trusted input · children
 * Read:   https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML#security_considerations
 *
 * @param {string} title
 * @param {string} [html]  markup from your own CMS, already sanitised there
 *
 * Rules:
 *  1. a <section> holding an <h3> with `title`, then the markup
 *  2. the markup goes in a <div data-testid="body"> and is rendered AS markup —
 *     "<b>hi</b>" produces a real <b> element
 *  3. entities in it are decoded: "&amp;" becomes one character on screen
 *  4. nothing is stripped, escaped or sanitised here. Whatever the string says
 *     ends up in the DOM, attributes and all
 *  5. no `html` — missing, null or empty — renders no body div at all
 *
 * Rules 1 and 2 collide, which is how React makes you notice what you are
 * doing: an element that is handed raw HTML cannot also have children, and
 * putting both on one node throws rather than silently picking a winner. Rule 4
 * is the cost. This is the opposite of the escaped-text challenge, and the only
 * thing standing between it and an XSS is your certainty about where the string
 * came from.
 */
export default function RichText() {
  return null
}
