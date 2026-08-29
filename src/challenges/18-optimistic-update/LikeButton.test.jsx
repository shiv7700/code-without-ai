import { act, render, screen } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import LikeButton from './LikeButton'

// onToggle you settle by hand.
function controllable() {
  const queue = []
  const onToggle = vi.fn(
    () => new Promise((resolve, reject) => queue.push({ resolve, reject })),
  )
  return {
    onToggle,
    resolve: (i = 0) => act(async () => queue[i].resolve()),
    reject: (i = 0) => act(async () => queue[i].reject(new Error('offline'))),
  }
}

const button = () => screen.getByRole('button')
const click = () => act(() => button().click())

test('flips immediately, before the request settles', async () => {
  const api = controllable()
  render(<LikeButton liked={false} count={10} onToggle={api.onToggle} />)

  expect(button()).toHaveTextContent('10')
  expect(button()).toHaveAttribute('aria-pressed', 'false')

  await click()

  expect(button()).toHaveTextContent('11')
  expect(button()).toHaveAttribute('aria-pressed', 'true')
  expect(api.onToggle).toHaveBeenCalledWith(true)
})

test('unliking decrements', async () => {
  const api = controllable()
  render(<LikeButton liked count={10} onToggle={api.onToggle} />)

  await click()

  expect(button()).toHaveTextContent('9')
  expect(button()).toHaveAttribute('aria-pressed', 'false')
  expect(api.onToggle).toHaveBeenCalledWith(false)
})

test('the button is disabled while the save is in flight', async () => {
  const api = controllable()
  render(<LikeButton liked={false} count={10} onToggle={api.onToggle} />)

  await click()
  expect(button()).toBeDisabled()

  await api.resolve()
  expect(button()).toBeEnabled()
})

test('a successful save keeps the optimistic value', async () => {
  const api = controllable()
  render(<LikeButton liked={false} count={10} onToggle={api.onToggle} />)

  await click()
  await api.resolve()

  expect(button()).toHaveTextContent('11')
  expect(button()).toHaveAttribute('aria-pressed', 'true')
})

test('a failed save rolls back and explains itself', async () => {
  const api = controllable()
  render(<LikeButton liked={false} count={10} onToggle={api.onToggle} />)

  await click()
  await api.reject()

  expect(button()).toHaveTextContent('10')
  expect(button()).toHaveAttribute('aria-pressed', 'false')
  expect(screen.getByText(/could not save/i)).toBeInTheDocument()
})

test('rolls back to the value before THIS click, not to the original prop', async () => {
  const api = controllable()
  render(<LikeButton liked={false} count={10} onToggle={api.onToggle} />)

  await click() // 10 -> 11 optimistic
  await api.resolve(0) // committed at 11

  await click() // 11 -> 10 optimistic
  await api.reject(1) // must go back to 11, not to the original 10

  expect(button()).toHaveTextContent('11')
  expect(button()).toHaveAttribute('aria-pressed', 'true')
})

test('a later success clears the error', async () => {
  const api = controllable()
  render(<LikeButton liked={false} count={10} onToggle={api.onToggle} />)

  await click()
  await api.reject(0)
  expect(screen.getByText(/could not save/i)).toBeInTheDocument()

  await click()
  await api.resolve(1)

  expect(screen.queryByText(/could not save/i)).not.toBeInTheDocument()
  expect(button()).toHaveTextContent('11')
})
