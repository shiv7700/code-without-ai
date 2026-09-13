import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { memo, useState } from 'react'
import { expect, test, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeContext'

function Readout() {
  const { theme, toggle } = useTheme()
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggle}>Toggle theme</button>
    </>
  )
}

const theme = () => screen.getByTestId('theme')

test('defaults to light', () => {
  render(
    <ThemeProvider>
      <Readout />
    </ThemeProvider>,
  )
  expect(theme()).toHaveTextContent('light')
})

test('respects defaultTheme', () => {
  render(
    <ThemeProvider defaultTheme="dark">
      <Readout />
    </ThemeProvider>,
  )
  expect(theme()).toHaveTextContent('dark')
})

test('toggle swaps light and dark', async () => {
  render(
    <ThemeProvider>
      <Readout />
    </ThemeProvider>,
  )

  await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
  expect(theme()).toHaveTextContent('dark')

  await userEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
  expect(theme()).toHaveTextContent('light')
})

test('useTheme outside a provider throws a message naming ThemeProvider', () => {
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})
  expect(() => render(<Readout />)).toThrow(/ThemeProvider/)
  quiet.mockRestore()
})

test('an unrelated parent re-render does not re-render consumers', async () => {
  let renders = 0
  // memo() means: only re-render if props change — or if consumed context changes.
  const Counted = memo(function Counted() {
    renders++
    useTheme()
    return null
  })

  function Parent() {
    const [n, setN] = useState(0)
    return (
      <ThemeProvider>
        <button onClick={() => setN(n + 1)}>bump {n}</button>
        <Counted />
      </ThemeProvider>
    )
  }

  render(<Parent />)
  const before = renders

  await userEvent.click(screen.getByRole('button', { name: /bump/i }))
  await userEvent.click(screen.getByRole('button', { name: /bump/i }))

  expect(renders).toBe(before)
})
