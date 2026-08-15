import type { Meta, StoryObj } from '@storybook/react-vite'
import { Section } from './section'
import { StatusRow } from './status-row'

/**
 * A page-section heading — deliberately NOT uppercase. Uppercase text is
 * measurably harder to read for people with dyslexia and lower literacy
 * (word-shape recognition breaks down when every letter is the same
 * height), and this system's own beneficiaries are exactly the population
 * that costs. Hierarchy comes from size, not case.
 */
const meta = {
  title: 'Primitives/Section',
  component: Section,
  parameters: { layout: 'padded' },
  argTypes: { tone: { control: 'select', options: [undefined, 'good', 'limit'] } },
  args: { label: 'You can do these now' },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Plain: Story = { args: { label: 'Recent activity' } }

export const WithTones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 420 }}>
      <Section label="You can do these now" tone="good">
        <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--theme-border)' }}>
          <StatusRow title="Check your grant payment" state="allowed" last />
        </div>
      </Section>
      <Section label="These need a higher level" tone="limit">
        <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--theme-border)' }}>
          <StatusRow title="Change your address" detail="Because it changes your official record" state="restricted" last />
        </div>
      </Section>
    </div>
  ),
}
