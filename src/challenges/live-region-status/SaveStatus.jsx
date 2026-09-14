/**
 * A live region announces changes, so it has to exist before there is one
 *
 * Topics: role=status · role=alert · live regions
 * Read:   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
 * Read:   https://www.w3.org/WAI/ARIA/apg/practices/structural-roles/
 *
 * Props: { message = '', tone = 'polite' }
 *
 * Rules:
 *  1. Two regions, in the document from the very first render and never
 *     removed: one with role="status" and one with role="alert".
 *  2. tone "polite" puts `message` in the status region. tone "error" puts it
 *     in the alert region. The other region is left empty.
 *  3. No message means both are empty, and the component shows nothing else.
 *  4. The message is visible text — this is the save indicator everyone can
 *     see, not a hidden announcement.
 *  5. The two region elements are the same two elements for the life of the
 *     component, whatever the message does.
 *
 * Rule 5 is the whole challenge, and the obvious build breaks it without
 * looking wrong. A region only announces when its contents change while it is
 * being watched: render the element and its text in the same go and there was
 * nothing to change, so the one user who needed telling hears nothing at all.
 */
export default function SaveStatus({ message = '', tone = 'polite' }) {
  return null
}
