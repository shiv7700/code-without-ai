/**
 * Autosave, and the four things it has to be honest about
 *
 * Topics: debounce · async status · the timer you have to clear
 * Read:   https://react.dev/reference/react/useEffect
 * Read:   https://react.dev/learn/synchronizing-with-effects
 *
 * Rules:
 *  1. takes `save(text)` — async — and `delay` in ms, defaulting to 800
 *  2. a "Note" box and a status line reading "Up to date" to begin with
 *  3. typing makes it "Unsaved changes" straight away
 *  4. `delay` ms after the last keystroke it calls save, and reads "Saving…"
 *  5. it worked: "Up to date". It threw: "Could not save"
 *  6. typing again during the wait restarts the wait — three quick words save once
 *
 * The timer is the whole thing. A new one on every keystroke without clearing
 * the last is six saves for six letters, and every one of them lands out of
 * order. `delay` is a prop so the spec can set it small — do not reach for a
 * clock of your own.
 */
export default function NoteEditor() {
  return null
}
