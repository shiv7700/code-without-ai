/**
 * Sometimes a wrapper, sometimes nothing, and the content written once
 *
 * Topics: conditional rendering · returning children · anchors
 * Read:   https://react.dev/learn/conditional-rendering
 * Read:   https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#href
 *
 * @param {string} [href]
 * @param {boolean} [external]
 *
 * Rules:
 *  1. `children` render exactly once, whatever the props say
 *  2. with an `href`, they sit inside an <a> carrying that href and the
 *     className "card-link"
 *  3. without one — missing, or an empty string — there is no <a> anywhere,
 *     and nothing else wrapped round the children either
 *  4. `external` adds target="_blank" and rel="noopener noreferrer"
 *  5. not external — neither attribute is present at all
 *
 * An <a> with no href is not a link. It has no role, it is not focusable, and
 * a keyboard never reaches it — so `<a href={href}>` for the missing case does
 * not degrade to plain text, it produces something that looks clickable and
 * is not. The other half of the exercise is rule 1: the branch decides what
 * goes around the content, so the content itself is not part of the branch.
 */
export default function MaybeLink() {
  return null
}
