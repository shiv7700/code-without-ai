import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Spreadsheet from './Spreadsheet'

const setup = () => {
  const user = userEvent.setup()
  render(<Spreadsheet />)
  return {
    user,
    type: async (ref, text) => {
      await user.clear(screen.getByLabelText(ref))
      await user.type(screen.getByLabelText(ref), text)
    },
  }
}

const value = (ref) => screen.getByTestId(`value-${ref}`).textContent

test('renders a three by three grid', () => {
  setup()
  expect(screen.getAllByRole('textbox')).toHaveLength(9)
  expect(screen.getByLabelText('C3')).toBeInTheDocument()
})

test('empty cells show nothing', () => {
  setup()
  expect(value('A1')).toBe('')
})

test('a number shows as itself', async () => {
  const { type } = setup()
  await type('A1', '42')

  expect(value('A1')).toBe('42')
})

test('plain text shows as itself', async () => {
  const { type } = setup()
  await type('A1', 'hello')

  expect(value('A1')).toBe('hello')
})

test('a formula adds two cells', async () => {
  const { type } = setup()
  await type('A1', '2')
  await type('B1', '3')
  await type('C1', '=A1+B1')

  expect(value('C1')).toBe('5')
})

test('the input keeps the formula, the cell shows the result', async () => {
  const { type } = setup()
  await type('A1', '2')
  await type('C1', '=A1+1')

  expect(screen.getByLabelText('C1')).toHaveValue('=A1+1')
  expect(value('C1')).toBe('3')
})

test('changing a source updates the formula', async () => {
  const { type } = setup()
  await type('A1', '2')
  await type('C1', '=A1+10')
  expect(value('C1')).toBe('12')

  await type('A1', '5')
  expect(value('C1')).toBe('15')
})

test('formulas can subtract, and mix in plain numbers', async () => {
  const { type } = setup()
  await type('A1', '10')
  await type('C1', '=A1-4+1')

  expect(value('C1')).toBe('7')
})

test('a formula can point at another formula', async () => {
  const { type } = setup()
  await type('A1', '2')
  await type('B1', '=A1+A1')
  await type('C1', '=A1+B1')

  expect(value('B1')).toBe('4')
  expect(value('C1')).toBe('6')
})

test('a chain updates all the way through', async () => {
  const { type } = setup()
  await type('A1', '1')
  await type('B1', '=A1+A1')
  await type('C1', '=B1+B1')
  expect(value('C1')).toBe('4')

  await type('A1', '3')
  expect(value('C1')).toBe('12')
})

test('text and empty cells count as zero in a sum', async () => {
  const { type } = setup()
  await type('A1', 'hello')
  await type('C1', '=A1+B1+7')

  expect(value('C1')).toBe('7')
})

test('a cell pointing at itself says so instead of hanging', async () => {
  const { type } = setup()
  await type('A1', '=A1+1')

  expect(value('A1')).toBe('#CYCLE')
})

test('two cells pointing at each other say so too', async () => {
  const { type } = setup()
  await type('A1', '=B1')
  await type('B1', '=A1')

  expect(value('A1')).toBe('#CYCLE')
  expect(value('B1')).toBe('#CYCLE')
})

test('a cycle only poisons the cells that depend on it', async () => {
  const { type } = setup()
  await type('A1', '=A1')
  await type('B1', '9')

  expect(value('B1')).toBe('9')
})
