import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './skeleton'

/**
 * A loading placeholder shaped like the content it stands in for, not a
 * generic spinner. The shimmer is a plain opacity pulse (R5) and is
 * collapsed to a static, still-legible fill under prefers-reduced-motion
 * — toggle "Reduced motion" in the a11y addon to see it hold still.
 */
const meta = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/** Shaped to the request card it stands in for — not a lone spinner. */
export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ width: 384, display: 'flex', flexDirection: 'column', gap: 12, padding: 16, borderRadius: 12, border: '1px solid var(--theme-border)' }}>
      <Skeleton style={{ height: 12, width: '30%' }} />
      <Skeleton style={{ height: 20, width: '85%' }} />
      <Skeleton style={{ height: 16, width: '55%' }} />
      <Skeleton style={{ height: 44, width: '60%', marginTop: 8 }} />
    </div>
  ),
}
