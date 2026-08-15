import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button'

/**
 * BRAND.md §9.2. Five variants — the same set mymzansi-app's React Native
 * Button ships, so a design reviewed on one platform reads the same on the
 * other. Depth comes from colour, never a shadow (elevation token: shadows
 * are "paint-heavy on low-end GPUs"). Press motion is transform/opacity
 * only (R5), timed from the motion tokens.
 */
const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'plain', 'destructive', 'destructive-outline'],
    },
    trailingIcon: { control: 'text' },
  },
  args: { children: 'Continue', variant: 'primary' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = { args: { variant: 'primary' } }
export const Secondary: Story = { args: { variant: 'secondary', children: 'Change details' } }
export const Plain: Story = { args: { variant: 'plain', children: 'Not now' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete account' } }
export const DestructiveOutline: Story = {
  args: { variant: 'destructive-outline', children: 'Sign out', trailingIcon: 'logout' },
}

/** The button-in-button trailing icon — carried over from the "elite"
 * comparison direction: nested in its own chip, it reads as considered at
 * rest and slides on hover (transform only). */
export const WithTrailingIcon: Story = {
  args: { variant: 'primary', children: 'Look at this request', trailingIcon: 'arrow_forward' },
}

export const Disabled: Story = { args: { variant: 'primary', disabled: true } }

/** All five together — the canonical variant sheet. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button variant="primary">Continue</Button>
      <Button variant="secondary">Change details</Button>
      <Button variant="plain">Not now</Button>
      <Button variant="destructive">Delete account</Button>
      <Button variant="destructive-outline" trailingIcon="logout">
        Sign out
      </Button>
    </div>
  ),
}

/**
 * Accessibility contract:
 * - min-height 44px (touch.min); destructive variants 48px (touch.min-spaced) — WCAG 2.5.5/2.5.8.
 * - Visible focus ring (2px accent) — never removed.
 * - Label wraps, never truncates (R4) — isiZulu labels run ~2x English.
 * - Trailing icon is aria-hidden; the label alone carries meaning (R3, §6.3).
 */
export const LongLabelWraps: Story = {
  args: { variant: 'primary', children: 'Qinisekisa ukuthi ungubani ngaphambi kokuqhubeka' },
  parameters: { layout: 'padded' },
}
