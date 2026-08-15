import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'

/**
 * Matches mymzansi-app's TextField — label above, sunk fill, hairline
 * border, touch.min height — plus the error state that RN component
 * doesn't have yet (a real gap the ui-ux audit flagged; built here first
 * because it's cheaper before it exists on both platforms). Error text is
 * linked via aria-describedby and announced with role="alert".
 */
const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: { layout: 'padded' },
  args: { label: 'ID number', placeholder: '13 digits' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: 'ID number', placeholder: '13 digits' } }
export const WithHelper: Story = {
  args: { label: 'ID number', placeholder: '13 digits', helperText: 'The 13-digit number on your green ID book or Smart ID card.' },
}
export const WithError: Story = {
  args: { label: 'Passport number', error: 'This field is required' },
}
