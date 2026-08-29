import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Modal from './Modal'

const open = (props = {}) =>
  render(
    <Modal open onClose={() => {}} title="Delete file?" {...props}>
      <p>This cannot be undone.</p>
    </Modal>,
  )

test('renders nothing when closed', () => {
  const { container } = render(
    <Modal open={false} onClose={() => {}} title="Hidden">
      <p>body</p>
    </Modal>,
  )
  expect(container).toBeEmptyDOMElement()
  expect(screen.queryByText('body')).not.toBeInTheDocument()
})

test('renders the title and children when open', () => {
  open()
  expect(screen.getByRole('heading', { name: 'Delete file?' })).toBeInTheDocument()
  expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
})

test('portals out — the dialog is not inside the render container', () => {
  const { container } = open()
  const dialog = screen.getByRole('dialog')

  expect(container.contains(dialog)).toBe(false)
  expect(document.body.contains(dialog)).toBe(true)
})

test('the dialog is a labelled modal', () => {
  open()
  const dialog = screen.getByRole('dialog')

  expect(dialog).toHaveAttribute('aria-modal', 'true')
  expect(dialog).toHaveAccessibleName('Delete file?')
})

test('Escape closes it', async () => {
  const onClose = vi.fn()
  open({ onClose })

  await userEvent.keyboard('{Escape}')
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking the backdrop closes it', () => {
  const onClose = vi.fn()
  open({ onClose })

  fireEvent.mouseDown(screen.getByTestId('backdrop'))
  expect(onClose).toHaveBeenCalledTimes(1)
})

test('clicking the content does not close it', () => {
  const onClose = vi.fn()
  open({ onClose })

  fireEvent.mouseDown(screen.getByText('This cannot be undone.'))
  expect(onClose).not.toHaveBeenCalled()
})

test('locks body scroll while open and restores it on close', () => {
  const { rerender } = open()
  expect(document.body.style.overflow).toBe('hidden')

  rerender(
    <Modal open={false} onClose={() => {}} title="Delete file?">
      <p>This cannot be undone.</p>
    </Modal>,
  )
  expect(document.body.style.overflow).not.toBe('hidden')
})

test('restores body scroll on unmount too', () => {
  const { unmount } = open()
  expect(document.body.style.overflow).toBe('hidden')

  unmount()
  expect(document.body.style.overflow).not.toBe('hidden')
})

test('Escape does nothing once closed', async () => {
  const onClose = vi.fn()
  render(
    <Modal open={false} onClose={onClose} title="x">
      <p>y</p>
    </Modal>,
  )

  await userEvent.keyboard('{Escape}')
  expect(onClose).not.toHaveBeenCalled()
})
