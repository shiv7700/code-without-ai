import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import ProfileCard from './ProfileCard'

const role = () => screen.getByTestId('role')

test('shows the name and the role', () => {
  render(<ProfileCard name="Ada" role="Admin" />)
  expect(screen.getByRole('heading')).toHaveTextContent('Ada')
  expect(role()).toHaveTextContent('Admin')
})

test('a missing role falls back to Member', () => {
  render(<ProfileCard name="Ada" />)
  expect(role()).toHaveTextContent('Member')
})

test('an explicit null role is kept, not defaulted', () => {
  render(<ProfileCard name="Ada" role={null} />)
  expect(role().textContent).toBe('')
})

test('no location, no location element', () => {
  render(<ProfileCard name="Ada" />)
  expect(screen.queryByTestId('location')).not.toBeInTheDocument()
})

test('location is rendered when given', () => {
  render(<ProfileCard name="Ada" location="Noida" />)
  expect(screen.getByTestId('location')).toHaveTextContent('Noida')
})
