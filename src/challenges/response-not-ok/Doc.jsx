/**
 * fetch does not reject on a 404
 *
 * Topics: fetch semantics · response.ok · throwing on purpose
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch
 * Read:   https://developer.mozilla.org/en-US/docs/Web/API/Response/ok
 *
 * @param {() => Promise<{ok: boolean, status: number, json: () => Promise<any>}>} request
 *
 * Rules:
 *  1. `ok: true` — render the title from `json()`
 *  2. `ok: false` — [role="alert"] reading "Request failed: {status}"
 *  3. a rejected promise is an error too, showing its message
 *  4. `json()` is not called at all when the response is not ok
 *
 * The promise resolves for a 404, a 500, everything. It only rejects when the
 * request never happened — offline, DNS, CORS. `.ok` is the other half.
 */
export default function Doc() {
  return null
}
