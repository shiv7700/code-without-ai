/**
 * The replacement string is not a string as far as replace is concerned
 *
 * Topics: String.replace · replacer functions · $ patterns
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_the_replacement
 *
 * @param {string} str    text with {placeholders} in it
 * @param {object} [vars] the values to drop in
 * @returns {string}
 *
 * Rules:
 *  1. `{key}` becomes `vars[key]`, converted to a string. The same key may
 *     appear as many times as it likes.
 *  2. A key is letters, digits and underscores only. `{ name }` with spaces
 *     around it is not a placeholder and stays exactly as written.
 *  3. A key with no value — absent, or explicitly undefined — is left in the
 *     text as it was written, braces and all, so the hole is visible.
 *  4. `0`, `''` and `false` are values and get substituted.
 *  5. The value goes in character for character. A value of "$&" puts those
 *     two characters on the page.
 *  6. No vars at all is not an error. Text with no placeholders comes back
 *     unchanged.
 *
 * Rule 5 is the one that reaches production and sits there. Hand `replace` a
 * string and it reads `$&`, `$1`, `` $` `` and `$$` inside it as instructions
 * rather than as text — so the day a price, a regex or a Windows path goes
 * through your templater, the output has characters in it that nobody wrote.
 */
export function template(str, vars = {}) {
  throw new Error('not implemented')
}
