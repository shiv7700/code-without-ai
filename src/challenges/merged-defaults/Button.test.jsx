import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Button from './Button'

const button = () => screen.getByRole('button')

test('no preset and no props gives the built-in defaults', () => {
  render(<Button>Save</Button>)
  expect(button().className).toBe('btn btn--solid btn--md')
})

test('the preset fills in what the caller did not say', () => {
  render(<Button preset={{ variant: 'ghost', size: 'lg' }}>Save</Button>)
  expect(button().className).toBe('btn btn--ghost btn--lg')
})

test('a prop on the element beats the preset', () => {
  render(
    <Button preset={{ variant: 'ghost', size: 'lg' }} variant="solid">
      Save
    </Button>,
  )
  expect(button().className).toBe('btn btn--solid btn--lg')
})

test('an explicit undefined is not a value', () => {
  const { rerender } = render(
    <Button preset={{ variant: 'ghost' }} variant={undefined}>
      Save
    </Button>,
  )
  expect(button().className).toBe('btn btn--ghost btn--md')

  rerender(<Button variant={undefined}>Save</Button>)
  expect(button().className).toBe('btn btn--solid btn--md')
})

test('the caller className goes last, and leaves no stray space', () => {
  const { rerender } = render(<Button className="wide">Save</Button>)
  expect(button().className).toBe('btn btn--solid btn--md wide')

  rerender(<Button>Save</Button>)
  expect(button().className).toBe('btn btn--solid btn--md')
})

test('styles merge key by key instead of replacing', () => {
  render(
    <Button preset={{ style: { color: 'red', marginTop: 8 } }} style={{ color: 'blue' }}>
      Save
    </Button>,
  )

  expect(button().style.color).toBe('blue')
  expect(button().style.marginTop).toBe('8px')
})
