import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Checkbox } from './checkbox'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(true)
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Checkbox checked={checked} onCheckedChange={(v) => setChecked(v === true)} />
        <span style={{ color: 'var(--theme-text)' }}>I agree to share these details this once</span>
      </label>
    )
  },
}

export const Unchecked: Story = { render: () => <Checkbox checked={false} /> }
export const Disabled: Story = { render: () => <Checkbox checked disabled /> }
