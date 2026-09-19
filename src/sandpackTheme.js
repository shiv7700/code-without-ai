// Sandpack renders in an iframe that cannot see our CSS variables, so the two
// palettes from app.css are repeated here by hand. Half the screen is this.
const font = {
  body: "'Lexend Variable', ui-sans-serif, sans-serif",
  mono: "'JetBrains Mono Variable', ui-monospace, monospace",
  size: '13px',
  lineHeight: '1.7',
}

const dark = {
  colors: {
    surface1: '#16161a',
    surface2: '#16161a',
    surface3: '#1f1f25',
    disabled: '#9a9aa6',
    base: '#d9d9e0',
    clickable: '#9a9aa6',
    hover: '#d9d9e0',
    accent: '#6ee7a8',
    error: '#ff8093',
    errorSurface: '#2a1a1f',
  },
  syntax: {
    plain: '#d9d9e0',
    comment: { color: '#9a9aa6', fontStyle: 'italic' },
    keyword: '#c4a2ff',
    tag: '#6ee7a8',
    punctuation: '#9a9aa6',
    definition: '#8fd0ff',
    property: '#8fd0ff',
    static: '#ffcf7a',
    string: '#ffcf7a',
  },
  font,
}

const light = {
  colors: {
    surface1: '#ffffff',
    surface2: '#ffffff',
    surface3: '#f3f3ef',
    disabled: '#5b5b64',
    base: '#1c1c22',
    clickable: '#5b5b64',
    hover: '#1c1c22',
    accent: '#0b7a49',
    error: '#c02a44',
    errorSurface: '#fdeef0',
  },
  syntax: {
    plain: '#1c1c22',
    comment: { color: '#5b5b64', fontStyle: 'italic' },
    keyword: '#6d3fc4',
    tag: '#0b7a49',
    punctuation: '#5b5b64',
    definition: '#1f6feb',
    property: '#1f6feb',
    static: '#9a5b00',
    string: '#9a5b00',
  },
  font,
}

export const sandpackThemes = { dark, light }
