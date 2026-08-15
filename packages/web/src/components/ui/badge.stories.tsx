import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

/**
 * R3: colour reinforces, never informs alone — the label text always
 * carries the meaning. The `limit` tone uses maize as a bright ground
 * with dark ink on top (R2), pinned to light-theme ink in both themes so
 * it never flips to an illegible chalk-on-maize pairing in dark mode.
 */
const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: { tone: { control: 'select', options: ['neutral', 'good', 'limit'] } },
  args: { children: 'Level 1 of 3', tone: 'neutral' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Neutral: Story = { args: { tone: 'neutral', children: 'Level 1 of 3' } }
export const Good: Story = { args: { tone: 'good', children: 'Visa approved' } }
export const Limit: Story = { args: { tone: 'limit', children: 'Application refused' } }

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Badge tone="neutral">Level 1 of 3</Badge>
      <Badge tone="good">Visa approved</Badge>
      <Badge tone="limit">Application refused</Badge>
    </div>
  ),
}
