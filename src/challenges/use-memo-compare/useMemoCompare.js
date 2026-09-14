/**
 * Keep the old object when the new one says the same thing
 *
 * Topics: useRef · referential identity · dependency arrays
 * Read:   https://react.dev/reference/react/useRef#referencing-a-value-with-a-ref
 * Read:   https://react.dev/learn/removing-effect-dependencies#do-you-want-to-read-a-value-without-reacting-to-changes
 *
 * @param {*} value
 * @param {(previous: *, next: *) => boolean} isEqual  you are handed the comparison
 * @returns {*} `value`, or the previous one if the comparison says they match
 *
 * Rules:
 *  1. the first render returns the value it was given
 *  2. a later value the comparison calls equal comes back as the PREVIOUS
 *     object — the identical one, not a copy of it
 *  3. a value the comparison calls different comes back as that new object
 *  4. once a different value has been adopted, later comparisons are against
 *     THAT one, not against the original
 *  5. the result is steady enough for a dependency array: an effect listing it
 *     does not re-run while the comparison keeps saying equal
 *
 * Rule 4 is where this usually rots. Storing the first value and comparing
 * every later one against it looks right for two renders, and then the prop
 * changes: from then on the stored value is a stranger, nothing ever matches
 * it, and the hook hands back a new object every render again — silently, with
 * every test up to rule 3 still green.
 */
export function useMemoCompare(value, isEqual) {
  throw new Error('not implemented')
}
