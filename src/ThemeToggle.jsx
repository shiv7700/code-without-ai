import { MoonIcon, SunIcon } from 'lucide-react'
import { toggleTheme, useTheme } from './theme'
import { Button } from '@/components/ui/button'

export function ThemeToggle({ size = 'xs' }) {
  const theme = useTheme()
  const Icon = theme === 'dark' ? SunIcon : MoonIcon

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      <Icon />
    </Button>
  )
}
