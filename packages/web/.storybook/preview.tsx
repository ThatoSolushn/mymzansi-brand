import type { Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import '../src/index.css'

/**
 * A toolbar toggle for the three theme states the tokens support:
 * `system` (no data-theme attribute — follows the OS, the un-stamped
 * default most viewers see), and explicit `light` / `dark` overrides.
 * The story canvas background is painted from --theme-bg so it always
 * matches whichever theme is active.
 */
const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'MyMzansi theme',
      defaultValue: 'system',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string
      useEffect(() => {
        const root = document.documentElement
        if (theme === 'system') root.removeAttribute('data-theme')
        else root.setAttribute('data-theme', theme)
        document.body.style.background = 'var(--theme-bg)'
        document.body.style.color = 'var(--theme-text)'
      }, [theme])
      return <Story />
    },
  ],
  parameters: {
    layout: 'centered',
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'todo' },
  },
}

export default preview
