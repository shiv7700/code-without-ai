import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Breadcrumbs from './Breadcrumbs'

const ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Reports', href: '/reports' },
  { label: 'Q3', href: '/reports/q3' },
]

test('the trail is a labelled nav', () => {
  render(<Breadcrumbs items={ITEMS} />)
  expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument()
})

test('one list item per crumb, separators included', () => {
  render(<Breadcrumbs items={ITEMS} />)
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
})

test('every crumb but the last is a link', () => {
  render(<Breadcrumbs items={ITEMS} />)

  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Q3' })).toBeNull()
})

test('the last crumb says it is the current page', () => {
  render(<Breadcrumbs items={ITEMS} />)
  expect(screen.getByText('Q3')).toHaveAttribute('aria-current', 'page')
})

test('a single crumb gets no separator', () => {
  render(<Breadcrumbs items={[{ label: 'Home', href: '/' }]} />)

  expect(screen.getAllByRole('listitem')).toHaveLength(1)
  expect(screen.queryByText('/')).toBeNull()
})

test('the separators are hidden from assistive tech and never counted', () => {
  render(<Breadcrumbs items={ITEMS} />)
  const seps = screen.getAllByText('/')

  expect(seps).toHaveLength(2)
  seps.forEach((s) => {
    expect(s).toHaveAttribute('aria-hidden', 'true')
    expect(s.tagName).not.toBe('LI')
  })
})
