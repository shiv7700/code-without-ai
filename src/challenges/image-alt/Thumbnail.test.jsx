import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Thumbnail from './Thumbnail'

const img = (container) => container.querySelector('img')

test('renders the image at a reserved size', () => {
  const { container } = render(<Thumbnail src="/cat.jpg" alt="A cat" />)

  expect(img(container)).toHaveAttribute('src', '/cat.jpg')
  expect(img(container)).toHaveAttribute('width', '160')
  expect(img(container)).toHaveAttribute('height', '90')
})

test('a given size is used instead', () => {
  const { container } = render(
    <Thumbnail src="/cat.jpg" alt="A cat" width={40} height={40} />,
  )

  expect(img(container)).toHaveAttribute('width', '40')
  expect(img(container)).toHaveAttribute('height', '40')
})

test('the alt is the accessible name', () => {
  render(<Thumbnail src="/cat.jpg" alt="A cat asleep on a keyboard" />)
  expect(screen.getByRole('img', { name: 'A cat asleep on a keyboard' })).toBeInTheDocument()
})

test('a decorative image is on the page but not in the accessibility tree', () => {
  const { container } = render(<Thumbnail src="/swirl.png" decorative />)

  expect(img(container)).toBeInTheDocument()
  expect(img(container)).toHaveAttribute('alt', '')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('decorative wins over an alt that was passed anyway', () => {
  const { container } = render(<Thumbnail src="/swirl.png" alt="A swirl" decorative />)

  expect(img(container)).toHaveAttribute('alt', '')
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})

test('no alt prop still writes the attribute', () => {
  const { container } = render(<Thumbnail src="/cat.jpg" />)

  expect(img(container).hasAttribute('alt')).toBe(true)
  expect(img(container).getAttribute('alt')).toBe('')
})
