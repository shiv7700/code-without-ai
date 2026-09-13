import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Meter from './Meter'

// The inline style, not the computed one — a browser resolves % widths to px.
const fill = () => screen.getByTestId('fill').style
const track = () => screen.getByTestId('track').style

test('the fill sits inside the track', () => {
  render(<Meter percent={40} />)
  expect(screen.getByTestId('track')).toContainElement(screen.getByTestId('fill'))
})

test('the width is a percentage, not pixels', () => {
  render(<Meter percent={40} />)
  expect(fill().width).toBe('40%')
})

test('the height is pixels without being told', () => {
  render(<Meter percent={40} />)
  expect(track().height).toBe('8px')
  expect(track().borderRadius).toBe('4px')
})

test('a taller meter rounds to match', () => {
  render(<Meter percent={40} height={20} />)
  expect(track().height).toBe('20px')
  expect(track().borderRadius).toBe('10px')
})

test('over a hundred stops at a hundred', () => {
  render(<Meter percent={150} />)
  expect(fill().width).toBe('100%')
})

test('below zero stops at zero', () => {
  render(<Meter percent={-10} />)
  expect(fill().width).toBe('0%')
})
