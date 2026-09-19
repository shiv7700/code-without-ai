import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import CountrySelect from './CountrySelect'

const box = () => screen.getByLabelText('Country')

test('lists the three countries by name', () => {
  render(<CountrySelect />)
  expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
    'India',
    'Germany',
    'Brazil',
  ])
})

test('India is chosen to begin with', () => {
  render(<CountrySelect />)
  expect(box()).toHaveValue('IN')
  expect(screen.getByText('Shipping to IN')).toBeInTheDocument()
})

test('choosing another country moves the value', async () => {
  render(<CountrySelect />)
  await userEvent.selectOptions(box(), 'DE')
  expect(box()).toHaveValue('DE')
  expect(screen.getByText('Shipping to DE')).toBeInTheDocument()
})

test('the code is what is stored, not the name', async () => {
  render(<CountrySelect />)
  await userEvent.selectOptions(box(), 'BR')
  expect(screen.queryByText('Shipping to Brazil')).not.toBeInTheDocument()
  expect(screen.getByText('Shipping to BR')).toBeInTheDocument()
})
