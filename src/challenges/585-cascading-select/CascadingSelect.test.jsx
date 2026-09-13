import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CascadingSelect from './CascadingSelect'

const COUNTRIES = [
  { id: 'in', name: 'India' },
  { id: 'fr', name: 'France' },
  { id: 'aq', name: 'Antarctica' },
]

const CITIES = {
  in: [
    { id: 'blr', name: 'Bengaluru' },
    { id: 'del', name: 'Delhi' },
  ],
  fr: [{ id: 'par', name: 'Paris' }],
  aq: [],
}

const after = (ms, value) => new Promise((r) => setTimeout(() => r(value), ms))

const setup = (delayFor = () => 1) => {
  const user = userEvent.setup()
  const onChange = vi.fn()
  const loadCountries = vi.fn(() => after(1, COUNTRIES))
  const loadCities = vi.fn((id) => after(delayFor(id), CITIES[id]))

  render(
    <CascadingSelect
      loadCountries={loadCountries}
      loadCities={loadCities}
      onChange={onChange}
    />,
  )
  return { user, onChange, loadCountries, loadCities }
}

const countrySelect = () => screen.getByLabelText('Country')
const citySelect = () => screen.getByLabelText('City')
const cityOptions = () =>
  [...citySelect().options].map((o) => o.textContent).filter((t) => t !== 'Choose a city')

test('loads the countries on mount', async () => {
  setup()
  expect(await screen.findByRole('option', { name: 'India' })).toBeInTheDocument()
})

test('the city select is disabled until a country is picked', async () => {
  setup()
  await screen.findByRole('option', { name: 'India' })

  expect(citySelect()).toBeDisabled()
})

test('picking a country loads its cities', async () => {
  const { user, loadCities } = setup()
  await screen.findByRole('option', { name: 'India' })
  await user.selectOptions(countrySelect(), 'in')

  expect(loadCities).toHaveBeenCalledWith('in')
  expect(await screen.findByRole('option', { name: 'Bengaluru' })).toBeInTheDocument()
})

test('it says so while the cities are loading', async () => {
  const { user } = setup(() => 30)
  await screen.findByRole('option', { name: 'India' })
  await user.selectOptions(countrySelect(), 'in')

  expect(screen.getByText('Loading cities…')).toBeInTheDocument()
  await screen.findByRole('option', { name: 'Bengaluru' })
  expect(screen.queryByText('Loading cities…')).not.toBeInTheDocument()
})

test('the city select opens up once the cities land', async () => {
  const { user } = setup()
  await screen.findByRole('option', { name: 'India' })
  await user.selectOptions(countrySelect(), 'in')
  await screen.findByRole('option', { name: 'Bengaluru' })

  expect(citySelect()).toBeEnabled()
})

test('choosing a city reports both halves', async () => {
  const { user, onChange } = setup()
  await screen.findByRole('option', { name: 'India' })
  await user.selectOptions(countrySelect(), 'in')
  await screen.findByRole('option', { name: 'Delhi' })
  await user.selectOptions(citySelect(), 'del')

  expect(onChange).toHaveBeenCalledWith({ country: 'in', city: 'del' })
})

test('changing the country clears the chosen city', async () => {
  const { user } = setup()
  await screen.findByRole('option', { name: 'India' })
  await user.selectOptions(countrySelect(), 'in')
  await screen.findByRole('option', { name: 'Delhi' })
  await user.selectOptions(citySelect(), 'del')

  await user.selectOptions(countrySelect(), 'fr')
  await screen.findByRole('option', { name: 'Paris' })

  expect(citySelect()).toHaveValue('')
})

test('the old country cities are gone, not left behind', async () => {
  const { user } = setup()
  await screen.findByRole('option', { name: 'India' })
  await user.selectOptions(countrySelect(), 'in')
  await screen.findByRole('option', { name: 'Delhi' })

  await user.selectOptions(countrySelect(), 'fr')
  await screen.findByRole('option', { name: 'Paris' })

  expect(cityOptions()).toEqual(['Paris'])
})

test('a country with no cities says so', async () => {
  const { user } = setup()
  await screen.findByRole('option', { name: 'Antarctica' })
  await user.selectOptions(countrySelect(), 'aq')

  expect(await screen.findByText('No cities')).toBeInTheDocument()
})

test('a slow response for an abandoned country is thrown away', async () => {
  const { user } = setup((id) => (id === 'in' ? 60 : 1))
  await screen.findByRole('option', { name: 'India' })

  await user.selectOptions(countrySelect(), 'in')
  await user.selectOptions(countrySelect(), 'fr')
  await screen.findByRole('option', { name: 'Paris' })

  await after(120)
  expect(cityOptions()).toEqual(['Paris'])
})
