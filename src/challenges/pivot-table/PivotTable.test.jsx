import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import PivotTable from './PivotTable'

const ROWS = [
  { region: 'North', year: 2023, amount: 100 },
  { region: 'South', year: 2022, amount: 200 },
  { region: 'North', year: 2023, amount: 50 },
  { region: 'East', year: 2021, amount: 300 },
  { region: 'South', year: 2023, amount: 250 },
  { region: '', year: 2022, amount: 100 },
]

const setup = () => ({
  user: userEvent.setup(),
  ...render(<PivotTable rows={ROWS} columns={['region', 'year']} value="amount" />),
})

const row = (tr) =>
  within(tr)
    .getAllByRole('cell')
    .map((td) => td.textContent.trim())
    .join(' ')
const groups = () => screen.getAllByTestId('group').map(row)
const total = () => row(screen.getByTestId('total'))

test('groups by the first column, counting the rows in each', () => {
  setup()
  expect(groups().map((g) => g.split(' ').slice(0, 2).join(' '))).toEqual([
    'North 2',
    'South 2',
    'East 1',
    '(none) 1',
  ])
})

test('the totals add up the column being measured', () => {
  setup()
  expect(groups()).toEqual([
    'North 2 150',
    'South 2 450',
    'East 1 300',
    '(none) 1 100',
  ])
})

test('the last row covers everything', () => {
  setup()
  expect(total()).toBe('All 6 1000')
})

test('rows with nothing in that column get a group of their own', () => {
  setup()
  expect(groups().at(-1)).toBe('(none) 1 100')
})

test('choosing another column regroups the same rows', async () => {
  const { user } = setup()
  await user.selectOptions(screen.getByLabelText('Group by'), 'year')

  expect(total()).toBe('All 6 1000')
  expect(groups()).toHaveLength(3)
})

test('a group sits where its first row put it, numbers or not', async () => {
  const { user } = setup()
  await user.selectOptions(screen.getByLabelText('Group by'), 'year')

  expect(groups()).toEqual(['2023 3 400', '2022 2 300', '2021 1 300'])
})
