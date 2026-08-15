import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, ICONS, type IconName } from './icon'

/**
 * Icon — the curated MyMzansi set drawn from Fluent UI System Icons (MIT).
 * Referenced by MyMzansi name (a semantic meaning like `verified`, or an
 * interface glyph like `arrowRight`), never a raw Fluent component, so the
 * whole set can be repointed in one place (BRAND.md §6). Every glyph inherits
 * the surrounding text colour (currentColor) and sizes from one `size` prop.
 */
const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: { layout: 'centered' },
  argTypes: {
    name: { control: 'select', options: Object.keys(ICONS) },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
  },
  args: { name: 'verified', size: 32 },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Colour is inherited — the icon takes the text colour of its context. */
export const InheritsColour: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <span style={{ color: 'var(--theme-text)' }}><Icon name="shield" size={28} /></span>
      <span style={{ color: 'var(--semantic-success)' }}><Icon name="verified" size={28} /></span>
      <span style={{ color: 'var(--semantic-critical)' }}><Icon name="failed" size={28} /></span>
      <span style={{ color: 'var(--theme-accent)' }}><Icon name="arrowRight" size={28} /></span>
    </div>
  ),
}

/** The full curated set — the same icons documented on the design-system Icons page. */
export const AllIcons: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
      {(Object.keys(ICONS) as IconName[]).map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            border: '1px solid var(--theme-border)',
            borderRadius: 12,
            color: 'var(--theme-text)',
          }}
        >
          <Icon name={name} size={24} />
          <span style={{ fontSize: 12, fontWeight: 700 }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
