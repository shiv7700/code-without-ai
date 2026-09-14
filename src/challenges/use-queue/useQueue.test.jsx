import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test } from 'vitest'
import { useQueue } from './useQueue'

let handed = []

function Probe({ initial }) {
  const [n, bump] = useState(0)
  const q = useQueue(initial)
  handed.push(q)
  return (
    <div>
      <output>
        {q.queue.join(',')} | first={String(q.first)} last={String(q.last)}{' '}
        size={q.size} n={n}
      </output>
      <button onClick={() => q.add('x')}>add</button>
      <button
        onClick={() => {
          q.add('one')
          q.add('two')
        }}
      >
        add two
      </button>
      <button onClick={q.remove}>remove</button>
      <button onClick={q.clear}>clear</button>
      <button onClick={() => bump((v) => v + 1)}>bump</button>
    </div>
  )
}

const out = () => screen.getByRole('status').textContent.replace(/\s+/g, ' ')
const press = (name) => userEvent.click(screen.getByRole('button', { name }))

function mount(initial) {
  handed = []
  render(<Probe initial={initial} />)
}

test('it starts from the initial queue', () => {
  mount(['a', 'b'])
  expect(out()).toBe('a,b | first=a last=b size=2 n=0')
})

test('add appends and remove takes from the front', async () => {
  mount(['a', 'b'])
  await press('add')
  expect(out()).toBe('a,b,x | first=a last=x size=3 n=0')
  await press('remove')
  expect(out()).toBe('b,x | first=b last=x size=2 n=0')
})

test('removing from an empty queue changes nothing, and clear empties it', async () => {
  mount(['a'])
  await press('clear')
  expect(out()).toBe(' | first=undefined last=undefined size=0 n=0')
  await press('remove')
  expect(out()).toBe(' | first=undefined last=undefined size=0 n=0')
})

test('two adds in the same handler both land', async () => {
  mount([])
  await press('add two')
  expect(out()).toBe('one,two | first=one last=two size=2 n=0')
})

test('the functions keep their identity across an unrelated re-render', async () => {
  mount([])
  const before = handed[0]

  await press('bump')
  await press('add')

  const after = handed.at(-1)
  expect(after.queue).toEqual(['x'])
  expect(after.add).toBe(before.add)
  expect(after.remove).toBe(before.remove)
  expect(after.clear).toBe(before.clear)
})
