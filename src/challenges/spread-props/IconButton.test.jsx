import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import IconButton from './IconButton'

const button = () => screen.getByRole('button')

test('the label becomes the accessible name', () => {
  render(<IconButton icon="x" label="Close" />)
  expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
})

test('the icon is what you see', () => {
  render(<IconButton icon="★" label="Star" />)
  expect(button()).toHaveTextContent('★')
})

test('no className means exactly the base class', () => {
  render(<IconButton icon="x" label="Close" />)
  expect(button().className).toBe('icon-button')
})

test('the caller className is appended, not replaced', () => {
  render(<IconButton icon="x" label="Close" className="danger" />)
  expect(button().className).toBe('icon-button danger')
})

test('unknown props reach the button', () => {
  render(<IconButton icon="x" label="Close" type="submit" data-kind="ghost" />)
  expect(button()).toHaveAttribute('type', 'submit')
  expect(button()).toHaveAttribute('data-kind', 'ghost')
})

test('onClick and disabled come along too', async () => {
  const onClick = vi.fn()
  const { rerender } = render(
    <IconButton icon="x" label="Close" onClick={onClick} />,
  )

  await userEvent.click(button())
  expect(onClick).toHaveBeenCalledTimes(1)

  rerender(<IconButton icon="x" label="Close" onClick={onClick} disabled />)
  await userEvent.click(button())
  expect(onClick).toHaveBeenCalledTimes(1)
})
