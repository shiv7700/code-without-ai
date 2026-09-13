import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Chip from './Chip'

const chip = () => screen.getByText('Tag').className

test('renders its children', () => {
  render(<Chip>Tag</Chip>)
  expect(screen.getByText('Tag')).toBeInTheDocument()
})

test('bare chip is exactly the base class', () => {
  render(<Chip>Tag</Chip>)
  expect(chip()).toBe('chip')
})

test('selected adds a modifier', () => {
  render(<Chip selected>Tag</Chip>)
  expect(chip()).toBe('chip chip--selected')
})

test('size is interpolated, and skipped when absent', () => {
  render(<Chip size="sm">Tag</Chip>)
  expect(chip()).toBe('chip chip--sm')
})

test('the caller className goes last', () => {
  render(
    <Chip selected size="lg" className="mine">
      Tag
    </Chip>,
  )
  expect(chip()).toBe('chip chip--selected chip--lg mine')
})

test('no double spaces, no trailing space', () => {
  render(
    <Chip selected={false} size={undefined} className={undefined}>
      Tag
    </Chip>,
  )
  expect(chip()).toBe('chip')
})
