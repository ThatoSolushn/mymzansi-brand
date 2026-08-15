import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusRow } from './status-row'

/**
 * BRAND.md §9.1 — a left status rail instead of an icon circle: faster to
 * scan, no cross-cultural icon ambiguity, far cheaper to render in a long
 * list. `state` colours the rail; `title` always carries the meaning in
 * words (R3), and restricted rows always state their reason (FR-F3-07).
 */
const meta = {
  title: 'Primitives/StatusRow',
  component: StatusRow,
  parameters: { layout: 'padded' },
  args: { title: 'Check your grant payment', state: 'allowed' },
} satisfies Meta<typeof StatusRow>

export default meta
type Story = StoryObj<typeof meta>

export const CapabilityList: Story = {
  render: () => (
    <div style={{ maxWidth: 420, overflow: 'hidden', borderRadius: 12, border: '1px solid var(--theme-border)' }}>
      <StatusRow title="Check your grant payment" state="allowed" />
      <StatusRow title="See your ID and licence" state="allowed" />
      <StatusRow title="Share your ID with a bank" detail="Because money can be moved with it" state="restricted" />
      <StatusRow title="Change your address" detail="Because it changes your official record" state="restricted" last />
    </div>
  ),
}

export const EachState: Story = {
  render: () => (
    <div style={{ maxWidth: 420, overflow: 'hidden', borderRadius: 12, border: '1px solid var(--theme-border)' }}>
      <StatusRow title="Allowed" detail="rail = success green" state="allowed" />
      <StatusRow title="Restricted" detail="rail = restricted ochre, title dimmed" state="restricted" />
      <StatusRow title="Attention" detail="rail = critical red" state="attention" />
      <StatusRow title="Neutral" detail="rail = border" state="neutral" last />
    </div>
  ),
}
