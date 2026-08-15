import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet, SheetTrigger, SheetContent, SheetTitle, SheetDescription, SheetClose } from './sheet'
import { Button } from './button'
import { StatusRow } from './status-row'

/**
 * A bottom sheet — the one menu idiom mymzansi-app already uses for both
 * its menus (AppMenu, LanguagePicker), factored out here as a shared
 * primitive. Built on Radix Dialog for the focus trap, Escape-to-close
 * and scroll lock; entrance uses the `slow` motion token, silenced under
 * prefers-reduced-motion. The scrim is tuned per theme (darker over an
 * already-dark background).
 */
const meta = {
  title: 'Primitives/Sheet',
  component: Sheet,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const AccountMenu: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Open menu</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription>Profile, settings and sign out — from one place, for whoever is signed in.</SheetDescription>
        <div style={{ overflow: 'hidden', borderRadius: 12, border: '1px solid var(--theme-border)' }}>
          <StatusRow title="Profile" state="neutral" />
          <StatusRow title="Settings" state="neutral" />
          <StatusRow title="About this app" state="neutral" last />
        </div>
        <SheetClose asChild>
          <Button variant="destructive-outline" trailingIcon="logout">
            Sign out
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  ),
}
