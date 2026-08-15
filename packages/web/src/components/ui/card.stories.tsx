import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardEyebrow, CardTitle, CardDescription, CardMeta, CardFooter } from './card'
import { Button } from './button'

/**
 * BRAND.md §9.1. Cards lift off the ground by a surface change and a
 * hairline border — not a shadow the cheap phone has to paint. `elevated`
 * opts into the lightest elevation token only for the rare case that
 * genuinely needs to sit above other cards.
 */
const meta = {
  title: 'Primitives/Card',
  component: Card,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** The canonical "a request came to you" card (FR-F1-02/03). Names are
 * invented — never a real institution. */
export const RequestCard: Story = {
  render: () => (
    <Card style={{ maxWidth: 384 }}>
      <CardEyebrow>Waiting for you</CardEyebrow>
      <CardTitle>ABC Bank wants to check your details</CardTitle>
      <CardDescription>To open a cheque account</CardDescription>
      <CardMeta>Asked 4 minutes ago</CardMeta>
      <CardFooter>
        <Button variant="primary" trailingIcon="arrow_forward">
          Look at this request
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card elevated style={{ maxWidth: 384 }}>
      <CardTitle>Elevated card</CardTitle>
      <CardDescription>Uses the lightest elevation token — reserved for cards that must sit above other cards.</CardDescription>
    </Card>
  ),
}
