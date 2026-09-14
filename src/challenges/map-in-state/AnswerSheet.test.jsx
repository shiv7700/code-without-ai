import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import AnswerSheet from './AnswerSheet'

const QUESTIONS = [
  { id: 'q1', prompt: 'Capital of France' },
  { id: 'q2', prompt: 'Largest ocean' },
]

const field = (prompt) => screen.getByLabelText(prompt)
const clear = (prompt) =>
  userEvent.click(screen.getByRole('button', { name: `Clear ${prompt}` }))
const count = () => screen.getByTestId('count').textContent
const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('starts with nothing answered', () => {
  render(<AnswerSheet questions={QUESTIONS} onChange={() => {}} />)

  expect(field('Capital of France')).toHaveValue('')
  expect(count()).toBe('0')
})

test('typing answers one question', async () => {
  const onChange = vi.fn()
  render(<AnswerSheet questions={QUESTIONS} onChange={onChange} />)

  await userEvent.type(field('Capital of France'), 'Paris')

  expect(field('Capital of France')).toHaveValue('Paris')
  expect(count()).toBe('1')
  expect(last(onChange).get('q1')).toBe('Paris')
})

test('each question keeps its own answer', async () => {
  const onChange = vi.fn()
  render(<AnswerSheet questions={QUESTIONS} onChange={onChange} />)

  await userEvent.type(field('Capital of France'), 'Paris')
  await userEvent.type(field('Largest ocean'), 'Pacific')

  expect([...last(onChange)]).toEqual([
    ['q1', 'Paris'],
    ['q2', 'Pacific'],
  ])
})

test('Clear takes the key out rather than blanking it', async () => {
  const onChange = vi.fn()
  render(<AnswerSheet questions={QUESTIONS} onChange={onChange} />)

  await userEvent.type(field('Capital of France'), 'Paris')
  await userEvent.type(field('Largest ocean'), 'Pacific')
  await clear('Capital of France')

  expect(field('Capital of France')).toHaveValue('')
  expect(last(onChange).has('q1')).toBe(false)
  expect(count()).toBe('1')
})

test('clearing the last answer leaves an empty Map', async () => {
  const onChange = vi.fn()
  render(<AnswerSheet questions={QUESTIONS} onChange={onChange} />)

  await userEvent.type(field('Largest ocean'), 'Pacific')
  await clear('Largest ocean')

  expect(last(onChange)).toBeInstanceOf(Map)
  expect(last(onChange).size).toBe(0)
  expect(count()).toBe('0')
})

test('it still works after everything has been cleared', async () => {
  render(<AnswerSheet questions={QUESTIONS} onChange={() => {}} />)

  await userEvent.type(field('Largest ocean'), 'Pacific')
  await clear('Largest ocean')
  await userEvent.type(field('Largest ocean'), 'Atlantic')

  expect(field('Largest ocean')).toHaveValue('Atlantic')
  expect(count()).toBe('1')
})
