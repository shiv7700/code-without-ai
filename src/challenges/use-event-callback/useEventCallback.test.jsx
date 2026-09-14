import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect, useState } from 'react'
import { expect, test, vi } from 'vitest'
import { useEventCallback } from './useEventCallback'

// Every render pushes the function it was handed, so a test can compare any
// two of them.
function probe({ onRender } = {}) {
  const handed = []
  function Probe({ suffix }) {
    const [n, bump] = useState(0)
    const call = useEventCallback((arg) => `${arg}-${suffix}-${n}`)
    handed.push(call)
    onRender?.(call)
    return (
      <button onClick={() => bump((v) => v + 1)}>
        {n}:{call('x')}
      </button>
    )
  }
  const view = render(<Probe suffix="one" />)
  return {
    handed,
    bump: () => userEvent.click(screen.getByRole('button')),
    setSuffix: (suffix) => view.rerender(<Probe suffix={suffix} />),
    unmount: view.unmount,
  }
}

test('calling it runs the function, arguments and result passed through', () => {
  probe()
  expect(screen.getByRole('button')).toHaveTextContent('0:x-one-0')
})

test('after a re-render it runs the newest function', () => {
  const { handed, setSuffix } = probe()
  setSuffix('two')
  expect(handed.at(-1)('x')).toBe('x-two-0')
})

test('the function from an old render still runs the newest body', () => {
  const { handed, setSuffix } = probe()
  const first = handed[0]
  setSuffix('two')
  expect(first('x')).toBe('x-two-0')
})

test('an effect running after a render reaches the function from that render', async () => {
  const calls = []
  function Host() {
    const [n, bump] = useState(0)
    const call = useEventCallback(() => n)
    useEffect(() => {
      calls.push(call())
    })
    return <button onClick={() => bump(1)}>go</button>
  }
  render(<Host />)
  await userEvent.click(screen.getByRole('button'))
  expect(calls).toEqual([0, 1])
})

test('an unrelated re-render does not change its identity', async () => {
  const { handed, bump, setSuffix } = probe()
  const first = handed[0]

  await bump()
  setSuffix('two')
  await bump()

  expect(handed.length).toBeGreaterThan(3)
  for (const call of handed) expect(call).toBe(first)
})
