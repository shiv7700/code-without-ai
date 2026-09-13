import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import FocusReturnModal from './FocusReturnModal'

function Host({ children = <button type="button">Save</button> }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open A
      </button>
      <button type="button" onClick={() => setOpen(true)}>
        Open B
      </button>
      <FocusReturnModal open={open} onClose={() => setOpen(false)} title="Settings">
        {children}
      </FocusReturnModal>
    </>
  )
}

const btn = (name) => screen.getByRole('button', { name })

test('renders nothing while closed', () => {
  render(
    <FocusReturnModal open={false} onClose={() => {}} title="Settings">
      <button type="button">Save</button>
    </FocusReturnModal>,
  )
  expect(screen.queryByRole('dialog')).toBeNull()
})

test('opening moves focus to the first control inside', async () => {
  render(<Host />)

  await userEvent.click(btn('Open A'))
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  expect(screen.getByRole('dialog')).toHaveAccessibleName('Settings')
  expect(btn('Save')).toHaveFocus()
})

test('a dialog with nothing focusable takes focus itself', async () => {
  render(<Host>{<p>Nothing to do here</p>}</Host>)

  await userEvent.click(btn('Open A'))
  expect(screen.getByRole('dialog')).toHaveFocus()
})

test('closing hands focus back to the button that opened it', async () => {
  render(<Host />)

  await userEvent.click(btn('Open B'))
  expect(btn('Save')).toHaveFocus()

  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(btn('Open B')).toHaveFocus()
})

test('it remembers the opener, not whatever ends up focused', async () => {
  render(<Host />)

  await userEvent.click(btn('Open A'))
  await userEvent.click(btn('Save')) // focus has moved on since it opened

  await userEvent.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(btn('Open A')).toHaveFocus()
})

test('Escape reports the close', async () => {
  const onClose = vi.fn()
  render(
    <FocusReturnModal open onClose={onClose} title="Settings">
      <button type="button">Save</button>
    </FocusReturnModal>,
  )

  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('unmounting while open returns focus too', async () => {
  const opener = document.createElement('button')
  document.body.append(opener)
  opener.focus()

  const { unmount } = render(
    <FocusReturnModal open onClose={() => {}} title="Settings">
      <button type="button">Save</button>
    </FocusReturnModal>,
  )
  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus()

  unmount()
  expect(opener).toHaveFocus()
  opener.remove()
})
