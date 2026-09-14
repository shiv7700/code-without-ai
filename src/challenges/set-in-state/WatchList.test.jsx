import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import WatchList from './WatchList'

const EPISODES = [
  { id: 'e1', title: 'Pilot' },
  { id: 'e2', title: 'The Meeting' },
  { id: 'e3', title: 'The Finale' },
]

const box = (title) => screen.getByLabelText(title)
const tick = (title) => userEvent.click(box(title))
const count = () => screen.getByTestId('count').textContent
const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('the boxes start from the Set it was given', () => {
  render(
    <WatchList
      episodes={EPISODES}
      initial={new Set(['e2'])}
      onChange={() => {}}
    />,
  )

  expect(box('The Meeting')).toBeChecked()
  expect(box('Pilot')).not.toBeChecked()
  expect(count()).toBe('1 of 3 watched')
})

test('ticking a box adds that id', async () => {
  const onChange = vi.fn()
  render(
    <WatchList episodes={EPISODES} initial={new Set()} onChange={onChange} />,
  )

  await tick('Pilot')

  expect(box('Pilot')).toBeChecked()
  expect(count()).toBe('1 of 3 watched')
  expect([...last(onChange)]).toEqual(['e1'])
})

test('unticking a box removes it, and leaves a Set behind', async () => {
  const onChange = vi.fn()
  render(
    <WatchList
      episodes={EPISODES}
      initial={new Set(['e1'])}
      onChange={onChange}
    />,
  )

  await tick('Pilot')

  expect(box('Pilot')).not.toBeChecked()
  expect(count()).toBe('0 of 3 watched')
  expect(last(onChange)).toBeInstanceOf(Set)
  expect(last(onChange).size).toBe(0)
})

test('the same box can be ticked, unticked and ticked again', async () => {
  render(
    <WatchList episodes={EPISODES} initial={new Set()} onChange={() => {}} />,
  )

  await tick('The Finale')
  await tick('The Finale')
  await tick('The Finale')

  expect(box('The Finale')).toBeChecked()
  expect(count()).toBe('1 of 3 watched')
})

test('the boxes change and the Set it was handed does not', async () => {
  const initial = new Set(['e1'])
  const onChange = vi.fn()
  render(
    <WatchList episodes={EPISODES} initial={initial} onChange={onChange} />,
  )

  await tick('The Meeting')
  await tick('Pilot')

  expect(count()).toBe('1 of 3 watched')
  expect([...initial]).toEqual(['e1'])
  expect(last(onChange)).not.toBe(initial)
})
