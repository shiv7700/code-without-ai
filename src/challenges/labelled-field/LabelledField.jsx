/**
 * Two ways to tie a label to an input, and only one needs an id
 *
 * Topics: labels · htmlFor · accessible names
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
 * Read:   https://react.dev/reference/react-dom/components/common
 *
 * @param {string} label
 * @param {string} [id]
 * @param {string} [type='text']
 *
 * Rules:
 *  1. a <label> holding `label`, and an <input> of the given type
 *  2. given an `id`, the input carries it and the label points at it — the two
 *     stay siblings, neither inside the other
 *  3. no `id` — the input goes INSIDE the label instead, and no id is invented
 *  4. either way the field is reachable by its label text
 *  5. two of these with the same label and no id are two separate fields, and
 *     typing in one does not touch the other
 *
 * Rule 5 is the test that fails a week after you ship, when the form grows a
 * second address block. A constant id, or one worked out from the label text,
 * is duplicated the moment the component is used twice — and duplicate ids do
 * not throw, they just quietly point every label at the first input on the page.
 */
export default function LabelledField() {
  return null
}
