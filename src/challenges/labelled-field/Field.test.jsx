import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import Field from './Field'

test('an id ties the label to the input from the outside', () => {
  const { container } = render(<Field label="Email" id="email" />)
  const input = screen.getByLabelText('Email')
  const label = container.querySelector('label')

  expect(input.id).toBe('email')
  expect(label).toHaveAttribute('for', 'email')
  expect(label.contains(input)).toBe(false)
})

test('with no id the input goes inside the label', () => {
  const { container } = render(<Field label="Email" />)
  const input = screen.getByLabelText('Email')

  expect(container.querySelector('label').contains(input)).toBe(true)
  expect(input.id).toBe('')
})

test('the type is passed on and defaults to text', () => {
  const { rerender } = render(<Field label="Email" />)
  expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'text')

  rerender(<Field label="Email" type="email" />)
  expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
})

test('two fields with the same label are two separate fields', async () => {
  render(
    <>
      <Field label="Email" />
      <Field label="Email" />
    </>,
  )

  const [first, second] = screen.getAllByLabelText('Email')
  await userEvent.type(first, 'a@b.com')

  expect(first).toHaveValue('a@b.com')
  expect(second).toHaveValue('')
})

test('ids given by the caller are used as given', () => {
  render(
    <>
      <Field label="Home" id="home" />
      <Field label="Work" id="work" />
    </>,
  )

  expect(screen.getByLabelText('Home').id).toBe('home')
  expect(screen.getByLabelText('Work').id).toBe('work')
})
