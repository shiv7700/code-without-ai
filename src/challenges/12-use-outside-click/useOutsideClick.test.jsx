import { fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { expect, test, vi } from 'vitest'
import { useOutsideClick } from './useOutsideClick'

function Widget({ handler, enabled }) {
  const ref = useRef(null)
  useOutsideClick(ref, handler, enabled)
  return (
    <div>
      <div ref={ref} data-testid="inside">
        <button>inner button</button>
      </div>
      <div data-testid="outside">outside area</div>
    </div>
  )
}

const down = (testid) => fireEvent.mouseDown(screen.getByTestId(testid))

test('a mousedown outside calls the handler', () => {
  const handler = vi.fn()
  render(<Widget handler={handler} />)

  down('outside')
  expect(handler).toHaveBeenCalledTimes(1)
})

test('a mousedown inside does not', () => {
  const handler = vi.fn()
  render(<Widget handler={handler} />)

  down('inside')
  fireEvent.mouseDown(screen.getByRole('button', { name: /inner/i }))

  expect(handler).not.toHaveBeenCalled()
})

test('enabled=false attaches nothing', () => {
  const handler = vi.fn()
  render(<Widget handler={handler} enabled={false} />)

  down('outside')
  expect(handler).not.toHaveBeenCalled()
})

test('toggling enabled back on starts listening again', () => {
  const handler = vi.fn()
  const { rerender } = render(<Widget handler={handler} enabled={false} />)

  rerender(<Widget handler={handler} enabled={true} />)
  down('outside')

  expect(handler).toHaveBeenCalledTimes(1)
})

test('the listener is removed on unmount', () => {
  const handler = vi.fn()
  const { unmount } = render(<Widget handler={handler} />)

  unmount()
  fireEvent.mouseDown(document.body)

  expect(handler).not.toHaveBeenCalled()
})

test('calls the LATEST handler without re-attaching every render', () => {
  const calls = []
  const add = vi.spyOn(document, 'addEventListener')

  const { rerender } = render(<Widget handler={() => calls.push('old')} />)
  const attachedOnce = add.mock.calls.filter(([type]) => type === 'mousedown').length

  rerender(<Widget handler={() => calls.push('new')} />)
  rerender(<Widget handler={() => calls.push('new')} />)

  const attachedAfter = add.mock.calls.filter(([type]) => type === 'mousedown').length
  add.mockRestore()

  down('outside')

  expect(calls).toEqual(['new'])
  expect(attachedAfter).toBe(attachedOnce) // no re-attaching on re-render
})
