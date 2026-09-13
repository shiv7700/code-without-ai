// Sandpack's built-in dark is its own grey, and it fills half the screen — two
// palettes arguing. These are the six colours from app.css, hard-coded because
// Sandpack renders in an iframe that cannot see our CSS variables.
const ink = '#16161a'
const panel = '#1f1f25'
const chalk = '#e6e6ea'
const dim = '#9a9aa6'
const go = '#6ee7a8'

export const sandpackTheme = {
  colors: {
    surface1: ink,
    surface2: ink,
    surface3: panel,
    disabled: dim,
    base: chalk,
    clickable: dim,
    hover: chalk,
    accent: go,
    error: '#ff8093',
    errorSurface: '#2a1a1f',
  },
  syntax: {
    plain: chalk,
    comment: { color: dim, fontStyle: 'italic' },
    keyword: '#c4a2ff',
    tag: go,
    punctuation: dim,
    definition: '#8fd0ff',
    property: '#8fd0ff',
    static: '#ffcf7a',
    string: '#ffcf7a',
  },
  font: {
    body: "'Archivo Variable', ui-sans-serif, sans-serif",
    mono: "'JetBrains Mono Variable', ui-monospace, monospace",
    size: '13px',
    lineHeight: '1.7',
  },
}
