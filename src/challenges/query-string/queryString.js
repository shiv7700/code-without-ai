/**
 * The bit of the URL after the question mark, both ways
 *
 * Topics: string parsing · encoding · repeated keys
 * Read:   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
 *
 * @param {string} query  with or without the leading '?'
 * @returns {object} key → string, or an array of strings when it repeats
 *
 * Rules:
 *  1. A leading `?` is stripped. An empty query gives an object with no keys.
 *  2. `debug` with no `=` reads as `''`, the same as `debug=`.
 *  3. A key appearing twice collects into an array, in the order it appeared.
 *     A key appearing once is a plain string, not an array of one.
 *  4. Keys and values are decoded. `+` is a space, and so is `%20`.
 *  5. `stringify` encodes both sides, skips `undefined` values, and writes an
 *     array as the same key repeated.
 *  6. A value containing `&` or `=` survives a round trip.
 *
 * Rule 4 is the one that leaks into production. `decodeURIComponent` does not
 * know about `+` — that is form encoding, not URL encoding — so a search for
 * "hello world" reaches the backend as `hello+world` and matches nothing. Rule
 * 6 is the other: `part.split('=')` throws away everything after the second
 * `=`, and an encoded value is exactly where the second one comes from.
 */
export function parse(query) {
  throw new Error('not implemented')
}

export function stringify(params) {
  throw new Error('not implemented')
}
