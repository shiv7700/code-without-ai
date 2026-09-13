import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import StepCounter from './StepCounter'

const total = () => screen.getByTestId('total')
const click = (name) => userEvent.click(screen.getByRole('button', { name }))

test('starts at 0, with a button per step and one to apply them all', () => {
  render(<StepCounter steps={[1, 2, 3]} />)

  expect(total()).toHaveTextContent('0')
  expect(screen.getAllByRole('button')).toHaveLength(4)
})

test('a step button adds its own step', async () => {
  render(<StepCounter steps={[1, 2, 3]} />)

  await click('+2')
  await click('+3')
  expect(total()).toHaveTextContent('5')
})

test('Apply all adds every step in a single click', async () => {
  render(<StepCounter steps={[1, 2, 3]} />)

  await click('Apply all')
  expect(total()).toHaveTextContent('6')
})

test('a repeated step counts every time it appears', async () => {
  render(<StepCounter steps={[2, 2]} />)

  await click('Apply all')
  expect(total()).toHaveTextContent('4')
})

test('Apply all carries on from the running total', async () => {
  render(<StepCounter steps={[1, 2, 3]} />)

  await click('Apply all')
  await click('Apply all')
  expect(total()).toHaveTextContent('12')
})
