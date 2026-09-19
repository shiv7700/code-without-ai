import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import PlanPicker from './PlanPicker'

const radio = (name) => screen.getByRole('radio', { name })

test('offers the three plans', () => {
  render(<PlanPicker />)
  expect(screen.getAllByRole('radio')).toHaveLength(3)
})

test('Free is picked to begin with', () => {
  render(<PlanPicker />)
  expect(radio('Free')).toBeChecked()
  expect(screen.getByText('You picked: Free')).toBeInTheDocument()
})

test('picking another moves the choice', async () => {
  render(<PlanPicker />)
  await userEvent.click(radio('Pro'))
  expect(radio('Pro')).toBeChecked()
  expect(screen.getByText('You picked: Pro')).toBeInTheDocument()
})

test('only ever one is picked', async () => {
  render(<PlanPicker />)
  await userEvent.click(radio('Pro'))
  await userEvent.click(radio('Team'))
  expect(screen.getAllByRole('radio').filter((r) => r.checked)).toHaveLength(1)
  expect(radio('Free')).not.toBeChecked()
  expect(radio('Pro')).not.toBeChecked()
})
