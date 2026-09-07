import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import FocusTrap from './FocusTrap'

const Fixture = ({ open, onClose }) => (
  <div>
    <button>Open</button>
    <FocusTrap open={open} onClose={onClose}>
      <button>First</button>
      <input aria-label="Name" />
      <button>Last</button>
    </FocusTrap>
  </div>
)

const setup = ({ open = true } = {}) => {
  const onClose = vi.fn()
  const user = userEvent.setup()
  const view = render(<Fixture open={open} onClose={onClose} />)
  return { user, onClose, view }
}

const tab = (shiftKey = false) =>
  fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey })

test('renders nothing when closed', () => {
  setup({ open: false })
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

test('renders a modal dialog when open', () => {
  setup()
  expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
})

test('it goes into a portal on the body, not next to the trigger', () => {
  setup()
  expect(screen.getByRole('dialog').closest('[data-testid="backdrop"]').parentElement).toBe(
    document.body,
  )
})

test('opening moves focus inside', () => {
  setup()
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
})

test('tab walks forward through the contents', () => {
  setup()
  tab()
  expect(screen.getByLabelText('Name')).toHaveFocus()
})

test('tab from the last one wraps to the first', () => {
  setup()
  tab()
  tab()
  expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()

  tab()
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()
})

test('shift+tab from the first wraps to the last', () => {
  setup()
  tab(true)
  expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus()
})

test('focus never escapes to the button behind', () => {
  setup()
  tab()
  tab()
  tab()
  tab()

  expect(screen.getByRole('button', { name: 'Open' })).not.toHaveFocus()
})

test('escape asks to close', () => {
  const { onClose } = setup()
  fireEvent.keyDown(document.activeElement, { key: 'Escape' })

  expect(onClose).toHaveBeenCalled()
})

test('clicking the backdrop asks to close', async () => {
  const { user, onClose } = setup()
  await user.click(screen.getByTestId('backdrop'))

  expect(onClose).toHaveBeenCalled()
})

test('clicking inside the dialog does not close it', async () => {
  const { user, onClose } = setup()
  await user.click(screen.getByRole('dialog'))

  expect(onClose).not.toHaveBeenCalled()
})

test('closing gives focus back to whatever had it', () => {
  const onClose = vi.fn()
  const view = render(<Fixture open={false} onClose={onClose} />)

  screen.getByRole('button', { name: 'Open' }).focus()
  view.rerender(<Fixture open onClose={onClose} />)
  expect(screen.getByRole('button', { name: 'First' })).toHaveFocus()

  view.rerender(<Fixture open={false} onClose={onClose} />)
  expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus()
})

test('the key listener is removed on close', () => {
  const { onClose, view } = setup()
  view.rerender(<Fixture open={false} onClose={onClose} />)
  onClose.mockClear()

  fireEvent.keyDown(document.body, { key: 'Escape' })
  expect(onClose).not.toHaveBeenCalled()
})
