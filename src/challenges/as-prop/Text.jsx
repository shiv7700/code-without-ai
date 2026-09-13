/**
 * A tag name held in a variable has to be capitalised to be one
 *
 * Topics: polymorphic components · element type · JSX capitalisation
 * Read:   https://react.dev/learn/your-first-component#nesting-and-organizing-components
 * Read:   https://react.dev/learn/writing-markup-with-jsx
 *
 * @param {string | Function} as  a tag name, or a component
 *
 * Rules:
 *  1. `children` render inside the element named by `as`
 *  2. `as` defaults to "p"
 *  3. `as` may be a component instead of a string, and it is given the same
 *     className and children
 *  4. className is "text", plus `tone` when a tone is given, separated by a space
 *
 * `<as>` in JSX is not your prop — it is the HTML element literally named "as",
 * which renders as an unknown tag and never errors. Lower-case names in JSX are
 * strings to React and capitalised ones are variables, so the naming convention
 * you thought was style has teeth.
 */
export default function Text() {
  return null
}
