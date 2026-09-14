import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import TypingTest from './TypingTest'

const TEXT = 'the quick brown fox jumps'

function clock(start = 1000) {
  let t = start
  return { now: () => t, advance: (ms) => (t += ms) }
}

const setup = (c = clock()) => {
  const view = render(<TypingTest text={TEXT} now={c.now} />)
  return {
    user: userEvent.setup(),
    box: screen.getByLabelText('Type here'),
    redraw: () => view.rerender(<TypingTest text={TEXT} now={c.now} />),
  }
}

const read = (id) => screen.getByTestId(id).textContent.trim()
const states = () =>
  screen.getAllByTestId('char').map((s) => s.dataset.state)

test('the text is waiting and nothing has been measured yet', () => {
  setup()
  expect(states()).toHaveLength(TEXT.length)
  expect(states().every((s) => s === 'pending')).toBe(true)
  expect(read('wpm')).toBe('0')
  expect(read('accuracy')).toBe('100%')
  expect(read('elapsed')).toBe('0')
})

test('each character is marked as it is typed', async () => {
  const { user, box } = setup()
  await user.type(box, 'thw')

  expect(states().slice(0, 4)).toEqual(['right', 'right', 'wrong', 'pending'])
})

test('the clock does not start when the page does', async () => {
  const c = clock()
  const { user, box } = setup(c)
  c.advance(60000)

  expect(read('elapsed')).toBe('0')
  await user.type(box, 't')
  expect(read('elapsed')).toBe('0')
})

test('the clock runs from the first keystroke', async () => {
  const c = clock()
  const { user, box } = setup(c)
  await user.type(box, 't')
  c.advance(30000)
  await user.type(box, 'h')

  expect(read('elapsed')).toBe('30')
})

test('words per minute is five characters a word', async () => {
  const c = clock()
  const { user, box } = setup(c)
  await user.type(box, TEXT[0])
  c.advance(60000)
  await user.type(box, TEXT.slice(1))

  expect(read('wpm')).toBe('5')
})

test('accuracy is the share you got right', async () => {
  const { user, box } = setup()
  await user.type(box, 'thX')

  expect(read('accuracy')).toBe('67%')
})

test('once the text is finished the numbers stop moving', async () => {
  const c = clock()
  const { user, box, redraw } = setup(c)
  await user.type(box, TEXT[0])
  c.advance(60000)
  await user.type(box, TEXT.slice(1))
  expect(read('status')).toBe('Finished')

  c.advance(60000)
  redraw()
  expect(read('wpm')).toBe('5')
  expect(read('elapsed')).toBe('60')
})
