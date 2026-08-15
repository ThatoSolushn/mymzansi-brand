import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './avatar'

/**
 * Initials-first, not photo-first: this system has no real user
 * photography anywhere, and a name is more reliably available than a
 * picture (the whole content model is text-first). Formalizes the ad hoc
 * initials-circle mymzansi-app's wallet screen invented inline.
 */
const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: { initials: 'TK' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Avatar initials="TK" size="sm" />
      <Avatar initials="TK" size="md" />
      <Avatar initials="TK" size="lg" />
    </div>
  ),
}
