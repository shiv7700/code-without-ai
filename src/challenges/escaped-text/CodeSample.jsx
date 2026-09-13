/**
 * JSX puts text on the page as text, never as markup
 *
 * Topics: escaping · text nodes · dangerouslySetInnerHTML
 * Read:   https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html
 * Read:   https://react.dev/learn/javascript-in-jsx-with-curly-braces
 *
 * Rules:
 *  1. `label` renders in a <figcaption>, `code` in a <code>
 *  2. whatever is in `code` shows character for character
 *  3. nothing in `code` may become an element — "<b>hi</b>" shows its brackets
 *  4. "&amp;" stays five characters long
 *
 * Rule 4 is the one that catches the shortcut. Hand the string to innerHTML and
 * the browser decodes the entity back to a single "&" and eats the tags, so the
 * text you were given stops being the text on screen.
 */
export default function CodeSample() {
  return null
}
