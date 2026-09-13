import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import DefinitionList from './DefinitionList'

const PAIRS = [
  { term: 'key', definition: 'an identity' },
  { term: 'prop', definition: 'an input' },
]

const dl = (container) => container.querySelector('dl')
const tags = (container) =>
  [...dl(container).children].map((el) => el.tagName)

test('renders a dl', () => {
  const { container } = render(<DefinitionList pairs={PAIRS} />)
  expect(dl(container)).toBeInTheDocument()
})

test('dt and dd alternate as direct children', () => {
  const { container } = render(<DefinitionList pairs={PAIRS} />)
  expect(tags(container)).toEqual(['DT', 'DD', 'DT', 'DD'])
})

test('nothing is wrapped around a pair', () => {
  const { container } = render(<DefinitionList pairs={PAIRS} />)
  expect(dl(container).querySelector('div')).toBeNull()
})

test('the text lands in the right elements', () => {
  const { container } = render(<DefinitionList pairs={PAIRS} />)
  const [dt, dd] = dl(container).children
  expect(dt).toHaveTextContent('key')
  expect(dd).toHaveTextContent('an identity')
})

test('no pairs still renders an empty dl', () => {
  const { container } = render(<DefinitionList pairs={[]} />)
  expect(dl(container)).toBeInTheDocument()
  expect(tags(container)).toEqual([])
})
