import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import Tabs from './Tabs'

function Sample({ defaultValue = 'a', onChange }) {
  return (
    <Tabs defaultValue={defaultValue} onChange={onChange}>
      <Tabs.List>
        <Tabs.Tab value="a">First</Tabs.Tab>
        <Tabs.Tab value="b">Second</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">panel A</Tabs.Panel>
      <Tabs.Panel value="b">panel B</Tabs.Panel>
    </Tabs>
  )
}

const tab = (name) => screen.getByRole('tab', { name })

test('renders a tablist with a tab per Tabs.Tab', () => {
  render(<Sample />)
  expect(screen.getByRole('tablist')).toBeInTheDocument()
  expect(screen.getAllByRole('tab')).toHaveLength(2)
})

test('only the default panel is in the DOM', () => {
  render(<Sample />)
  expect(screen.getByText('panel A')).toBeInTheDocument()
  expect(screen.queryByText('panel B')).not.toBeInTheDocument()
})

test('aria-selected tracks the active tab', () => {
  render(<Sample />)
  expect(tab('First')).toHaveAttribute('aria-selected', 'true')
  expect(tab('Second')).toHaveAttribute('aria-selected', 'false')
})

test('clicking a tab swaps the panel', async () => {
  render(<Sample />)

  await userEvent.click(tab('Second'))
  expect(screen.getByText('panel B')).toBeInTheDocument()
  expect(screen.queryByText('panel A')).not.toBeInTheDocument()
  expect(tab('Second')).toHaveAttribute('aria-selected', 'true')
})

test('onChange fires with the new value', async () => {
  const onChange = vi.fn()
  render(<Sample onChange={onChange} />)

  await userEvent.click(tab('Second'))
  expect(onChange).toHaveBeenCalledWith('b')
})

test('clicking the already-active tab does not fire onChange', async () => {
  const onChange = vi.fn()
  render(<Sample onChange={onChange} />)

  await userEvent.click(tab('First'))
  expect(onChange).not.toHaveBeenCalled()
})

test('no defaultValue means no panel is shown', () => {
  render(
    <Tabs>
      <Tabs.List>
        <Tabs.Tab value="a">First</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">panel A</Tabs.Panel>
      <Tabs.Panel value="b">panel B</Tabs.Panel>
    </Tabs>,
  )
  expect(screen.queryByText('panel A')).not.toBeInTheDocument()
  expect(screen.queryByText('panel B')).not.toBeInTheDocument()
})

test('the pieces throw when used outside Tabs', () => {
  const quiet = vi.spyOn(console, 'error').mockImplementation(() => {})

  expect(() => render(<Tabs.Tab value="a">x</Tabs.Tab>)).toThrow(/Tabs/)
  expect(() => render(<Tabs.Panel value="a">x</Tabs.Panel>)).toThrow(/Tabs/)
  expect(() => render(<Tabs.List>x</Tabs.List>)).toThrow(/Tabs/)

  quiet.mockRestore()
})
