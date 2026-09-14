import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import { useConstant } from './useConstant'

const seen = []

function Probe({ factory, label = 'a' }) {
  const [n, bump] = useState(0)
  const value = useConstant(factory)
  seen.push(value)
  return (
    <button onClick={() => bump(n + 1)}>
      {label}:{String(value?.tag)}:{n}
    </button>
  )
}

function mount(factory) {
  seen.length = 0
  render(<Probe factory={factory} />)
  return { rerender: () => userEvent.click(screen.getByRole('button')) }
}

test('returns what the factory built', () => {
  mount(() => ({ tag: 'store' }))
  expect(screen.getByRole('button')).toHaveTextContent('a:store:0')
})

test('every later render hands back the identical value', async () => {
  const { rerender } = mount(() => ({ tag: 'store' }))
  await rerender()
  await rerender()
  expect(seen).toHaveLength(3)
  expect(seen[1]).toBe(seen[0])
  expect(seen[2]).toBe(seen[0])
})

test('mutating it is visible on the next render', async () => {
  const { rerender } = mount(() => ({ tag: 'store' }))
  seen[0].tag = 'mutated'
  await rerender()
  expect(screen.getByRole('button')).toHaveTextContent('a:mutated:1')
})

test('two mounted components each get their own', () => {
  const factory = vi.fn(() => ({ tag: 'store' }))
  render(
    <>
      <Probe factory={factory} label="a" />
      <Probe factory={factory} label="b" />
    </>,
  )
  expect(factory).toHaveBeenCalledTimes(2)
  expect(seen.at(-1)).not.toBe(seen.at(-2))
})

test('a factory that returns null is still only called once', async () => {
  const factory = vi.fn(() => null)
  const { rerender } = mount(factory)

  await rerender()
  await rerender()

  expect(screen.getByRole('button')).toHaveTextContent('a:undefined:2')
  expect(factory).toHaveBeenCalledTimes(1)
})
