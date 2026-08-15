import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from './radio-group'

/**
 * Formalizes the manual Pressable-list-with-"Selected"-label pattern
 * mymzansi-app's visitor-apply.tsx hand-rolls for visa reason selection.
 * The visible label beside each item carries the meaning (R3); the ring
 * colour only reinforces it.
 */
const meta = {
  title: 'Primitives/RadioGroup',
  component: RadioGroup,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const VisaReason: Story = {
  render: () => (
    <RadioGroup defaultValue="tourism" style={{ maxWidth: 360 }}>
      {[
        ['tourism', 'Tourism', 'Holiday, sightseeing, visiting friends'],
        ['business', 'Business', 'Meetings, conferences, short-term work'],
        ['study', 'Study', 'A short course or exchange programme'],
      ].map(([value, label, detail]) => (
        <label key={value} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <RadioGroupItem value={value} style={{ marginTop: 2 }} />
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--theme-text)', fontWeight: 600 }}>{label}</span>
            <span style={{ color: 'var(--theme-text-3)', fontSize: 13 }}>{detail}</span>
          </span>
        </label>
      ))}
    </RadioGroup>
  ),
}
