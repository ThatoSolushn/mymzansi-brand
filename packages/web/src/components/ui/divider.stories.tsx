import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './divider'

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: 360, color: 'var(--theme-text)' }}>
      <p style={{ margin: '0 0 16px' }}>Above the rule</p>
      <Divider />
      <p style={{ margin: '16px 0 0' }}>Below the rule</p>
    </div>
  ),
}
