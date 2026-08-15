import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Switch } from './switch'

/**
 * Built on Radix for the accessibility contract (role="switch", keyboard,
 * focus, checked state) rather than reimplementing a toggle. The thumb
 * translates on `transform` only (R5); the track colour transition is
 * silenced under prefers-reduced-motion by the global override.
 */
const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: () => {
    const [on, setOn] = useState(true)
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Switch checked={on} onCheckedChange={setOn} />
        <span style={{ color: 'var(--theme-text)' }}>Visa and expiry reminders</span>
      </label>
    )
  },
}

export const Off: Story = { render: () => <Switch checked={false} /> }
export const Disabled: Story = { render: () => <Switch checked disabled /> }
