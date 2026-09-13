import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Greeting from './Greeting'

const heading = () => screen.getByRole('heading')

test('greets the name it is given', () => {
  render(<Greeting name="Shivang" />)
  expect(heading()).toHaveTextContent('Hello, Shivang!')
})

test('greets "there" when no name is given', () => {
  render(<Greeting />)
  expect(heading()).toHaveTextContent('Hello, there!')
})

test('excited triples the bang', () => {
  render(<Greeting name="Ada" excited />)
  expect(heading()).toHaveTextContent('Hello, Ada!!!')
})

test('excited is off unless asked for', () => {
  render(<Greeting name="Ada" />)
  expect(heading().textContent).toBe('Hello, Ada!')
})
