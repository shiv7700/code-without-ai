import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import SettingsPanel from './SettingsPanel'

const build = () => ({
  user: { name: 'Ada' },
  prefs: { theme: 'light', notify: { email: false } },
})

const last = (onChange) => onChange.mock.calls.at(-1)[0]

test('every control shows the current settings', () => {
  render(<SettingsPanel settings={build()} onChange={() => {}} />)

  expect(screen.getByLabelText('Name')).toHaveValue('Ada')
  expect(screen.getByLabelText('Theme')).toHaveValue('light')
  expect(screen.getByLabelText('Email')).not.toBeChecked()
})

test('changing the theme reports the whole settings object', async () => {
  const onChange = vi.fn()
  render(<SettingsPanel settings={build()} onChange={onChange} />)

  await userEvent.selectOptions(screen.getByLabelText('Theme'), 'dark')

  expect(last(onChange)).toEqual({
    user: { name: 'Ada' },
    prefs: { theme: 'dark', notify: { email: false } },
  })
})

test('the checkbox reaches two levels down', async () => {
  const onChange = vi.fn()
  render(<SettingsPanel settings={build()} onChange={onChange} />)

  await userEvent.click(screen.getByLabelText('Email'))

  expect(screen.getByLabelText('Email')).toBeChecked()
  expect(last(onChange).prefs.notify.email).toBe(true)
})

test('the settings it was handed are untouched at every depth', async () => {
  const settings = build()
  render(<SettingsPanel settings={settings} onChange={() => {}} />)

  await userEvent.click(screen.getByLabelText('Email'))
  await userEvent.type(screen.getByLabelText('Name'), '!')

  expect(settings).toEqual(build())
})

test('the branch that did not change is shared, not copied', async () => {
  const settings = build()
  const onChange = vi.fn()
  render(<SettingsPanel settings={settings} onChange={onChange} />)

  await userEvent.selectOptions(screen.getByLabelText('Theme'), 'dark')
  const next = last(onChange)

  expect(next).not.toBe(settings)
  expect(next.prefs).not.toBe(settings.prefs)
  expect(next.user).toBe(settings.user)
  expect(next.prefs.notify).toBe(settings.prefs.notify)
})
