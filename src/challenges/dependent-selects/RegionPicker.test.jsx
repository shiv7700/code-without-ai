import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import RegionPicker from './RegionPicker'

// Every call is held open and settled by name, so the test can answer the first
// request after the second — which is the case rule 6 is about.
function loader() {
  const pending = new Map()
  const loadCities = (country) =>
    new Promise((resolve) => pending.set(country, resolve))
  return {
    loadCities,
    asked: () => [...pending.keys()],
    give: (country, cities) =>
      act(async () => pending.get(country)(cities)),
  }
}

const country = () => screen.getByLabelText('Country')
const city = () => screen.getByLabelText('City')
const cityNames = () =>
  [...city().querySelectorAll('option')].map((o) => o.textContent)

test('asks for the starting country', () => {
  const t = loader()
  render(<RegionPicker loadCities={t.loadCities} />)
  expect(t.asked()).toEqual(['IN'])
})

test('the city list is disabled until it lands', async () => {
  const t = loader()
  render(<RegionPicker loadCities={t.loadCities} />)
  expect(city()).toBeDisabled()
  await t.give('IN', ['Pune', 'Kochi'])
  expect(city()).toBeEnabled()
  expect(cityNames()).toEqual(['Pune', 'Kochi'])
})

test('changing country asks for the new one', async () => {
  const t = loader()
  render(<RegionPicker loadCities={t.loadCities} />)
  await t.give('IN', ['Pune'])
  await userEvent.selectOptions(country(), 'DE')
  expect(t.asked()).toContain('DE')
})

test('the old city goes the moment the country changes', async () => {
  const t = loader()
  render(<RegionPicker loadCities={t.loadCities} />)
  await t.give('IN', ['Pune', 'Kochi'])
  await userEvent.selectOptions(city(), 'Kochi')
  expect(city()).toHaveValue('Kochi')

  await userEvent.selectOptions(country(), 'DE')
  expect(cityNames()).toEqual([])
  expect(city()).toBeDisabled()
})

test('a late answer for an old country is ignored', async () => {
  const t = loader()
  render(<RegionPicker loadCities={t.loadCities} />)
  await t.give('IN', ['Pune'])

  await userEvent.selectOptions(country(), 'DE')
  await userEvent.selectOptions(country(), 'BR')

  // BR answers first, then the earlier DE request finally lands.
  await t.give('BR', ['Recife'])
  await t.give('DE', ['Berlin'])

  expect(cityNames()).toEqual(['Recife'])
})
