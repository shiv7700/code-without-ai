import { useEffect } from 'react'
import { toast } from 'sonner'

// Four of them, so the twentieth time is less grating than the first.
const PASTE = [
  'Not here. Typing it out is the exercise.',
  'Paste is off. The rep is the deliverable, not the working code.',
  'No. Read the failure again, then write it.',
  'Blocked. Ten minutes stuck first — that was the deal.',
]

const COPY = [
  'Copy is off too. Whatever you were going to paste that into cannot help.',
  'Nothing leaves the editor. That is rather the point.',
]

const pick = (lines) => lines[Math.floor(Math.random() * lines.length)]

// CodeMirror's own root class, and the reason this listens on the document
// rather than on a wrapper: Sandpack sizes the editor as a direct child of its
// layout row, so anything rendered around it risks the row instead.
const EDITOR = '.cm-editor'

// Renders nothing — it is here for the effect, like SaveCode. Pasting a solution
// in is the one thing this repo exists to prevent, so the editor refuses
// clipboard traffic in both directions.
//
// Capture phase: CodeMirror handles paste on its own content element and has
// already inserted the text by the time anything bubbling runs.
export function NoPaste() {
  useEffect(() => {
    const block = (lines) => (event) => {
      if (!event.target?.closest?.(EDITOR)) return
      event.preventDefault()
      event.stopPropagation()
      toast(pick(lines))
    }

    const onPaste = block(PASTE)
    const onCopy = block(COPY)

    document.addEventListener('paste', onPaste, true)
    document.addEventListener('copy', onCopy, true)
    document.addEventListener('cut', onCopy, true)

    return () => {
      document.removeEventListener('paste', onPaste, true)
      document.removeEventListener('copy', onCopy, true)
      document.removeEventListener('cut', onCopy, true)
    }
  }, [])

  return null
}
