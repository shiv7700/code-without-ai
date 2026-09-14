import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import { useLazyRef } from './useLazyRef'

function Probe({ init, label = 'a' }) {
  const [n, bump] = useState(0)
  const ref = useLazyRef(init)
  seen.push(ref)
  return (
    <button onClick={() => bump(n + 1)}>
      {label}:{ref.current.tag}:{n}
    </button>
  )
}

let seen = []

function mount(init) {
  seen = []
  render(<Probe init={init} />)
  return {
    rerender: () => userEvent.click(screen.getByRole('button')),
    seen,
  }
}

test('the ref holds what the initialiser returned', () => {
  mount(() => ({ tag: 'made' }))
  expect(screen.getByRole('button')).toHaveTextContent('a:made:0')
})

test('it is the same ref object on every render', async () => {
  const { rerender, seen } = mount(() => ({ tag: 'made' }))
  await rerender()
  await rerender()
  expect(seen).toHaveLength(3)
  expect(seen[1]).toBe(seen[0])
  expect(seen[2]).toBe(seen[0])
})

test('a value written to current survives a re-render', async () => {
  const { rerender, seen } = mount(() => ({ tag: 'made' }))
  seen[0].current = { tag: 'replaced' }
  await rerender()
  expect(screen.getByRole('button')).toHaveTextContent('a:replaced:1')
})

test('two mounted components each get their own', () => {
  const init = vi.fn(() => ({ tag: 'made' }))
  render(
    <>
      <Probe init={init} label="a" />
      <Probe init={init} label="b" />
    </>,
  )
  expect(init).toHaveBeenCalledTimes(2)
})

test('the initialiser runs once however many times the component renders', async () => {
  const init = vi.fn(() => ({ tag: 'made' }))
  const { rerender } = mount(init)

  await rerender()
  await rerender()
  await rerender()

  expect(screen.getByRole('button')).toHaveTextContent('a:made:3')
  expect(init).toHaveBeenCalledTimes(1)
})
