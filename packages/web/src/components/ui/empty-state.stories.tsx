import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from './empty-state'

/**
 * R11: never a dead end — the action, when given, is the concrete next
 * step, not a decorative illustration standing in for one.
 */
const meta = {
  title: 'Primitives/EmptyState',
  component: EmptyState,
  parameters: { layout: 'padded' },
  args: { title: 'No documents yet' },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const NoDocuments: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <EmptyState
        icon="inbox"
        title="No documents yet"
        description="Documents you're issued will show up here."
        action={{ label: 'Learn how to get your first ID', trailingIcon: 'arrowRight' }}
      />
    </div>
  ),
}

export const NoAction: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <EmptyState icon="clock" title="Nothing here yet" description="Anything you do will be listed here, newest first." />
    </div>
  ),
}
