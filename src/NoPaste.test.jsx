import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { NoPaste } from './NoPaste'

// CodeMirror inserts on its own handler, so anything listening only on the
// bubble phase is too late. These fire at the target, the way the real one does.
const fire = (label, type) => {
  const event = new Event(type, { bubbles: true, cancelable: true })
  screen.getByLabelText(label).dispatchEvent(event)
  return event
}

// `.cm-editor` is what the component scopes to — inside it is the editor, and
// everything else on the page is not.
const page = () => (
  <>
    <NoPaste />
    <div className="cm-editor">
      <input aria-label="editor" defaultValue="code" />
    </div>
    <div>
      <input aria-label="elsewhere" />
    </div>
  </>
)

test('paste into the editor is refused', () => {
  render(page())
  expect(fire('editor', 'paste').defaultPrevented).toBe(true)
})

test('copy and cut are refused too', () => {
  render(page())
  expect(fire('editor', 'copy').defaultPrevented).toBe(true)
  expect(fire('editor', 'cut').defaultPrevented).toBe(true)
})

// The spec panel and the rest of the page are not the exercise.
test('the rest of the page keeps its clipboard', () => {
  render(page())
  expect(fire('elsewhere', 'paste').defaultPrevented).toBe(false)
  expect(fire('elsewhere', 'copy').defaultPrevented).toBe(false)
})

test('typing is untouched', () => {
  render(page())
  expect(fire('editor', 'input').defaultPrevented).toBe(false)
  expect(screen.getByLabelText('editor')).toHaveValue('code')
})

test('the listeners go when the challenge does', () => {
  const { unmount } = render(page())
  const input = screen.getByLabelText('editor')
  unmount()

  document.body.appendChild(input.closest('.cm-editor') ?? input)
  const event = new Event('paste', { bubbles: true, cancelable: true })
  input.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
})
