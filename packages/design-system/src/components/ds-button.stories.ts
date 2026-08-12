import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

import './ds-button.js';
import type { DsButtonSize, DsButtonVariant } from './ds-button.js';

interface DsButtonProps {
  variant: DsButtonVariant;
  size: DsButtonSize;
  disabled: boolean;
  loading: boolean;
  fullWidth: boolean;
  label: string;
}

const meta: Meta<DsButtonProps> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  component: 'ds-button',
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'ghost'] satisfies DsButtonVariant[],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'] satisfies DsButtonSize[],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    label: { control: 'text', description: 'Slotted button text.' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    fullWidth: false,
    label: 'Catch it',
  },
  render: (args) => html`
    <ds-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      ?full-width=${args.fullWidth}
      @ds-click=${() => console.log('ds-click')}
    >
      ${args.label}
    </ds-button>
  `,
};

export default meta;
type Story = StoryObj<DsButtonProps>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; align-items: center;">
      <ds-button variant="primary">Primary</ds-button>
      <ds-button variant="secondary">Secondary</ds-button>
      <ds-button variant="ghost">Ghost</ds-button>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; align-items: center;">
      <ds-button size="sm">Small</ds-button>
      <ds-button size="md">Medium</ds-button>
      <ds-button size="lg">Large</ds-button>
    </div>
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: 0.75rem; align-items: center;">
      <ds-button>Idle</ds-button>
      <ds-button loading>Loading</ds-button>
      <ds-button disabled>Disabled</ds-button>
    </div>
  `,
};

export const WithLeadingIcon: Story = {
  render: () => html`
    <ds-button variant="secondary">
      <span slot="leading" aria-hidden="true">&#9679;</span>
      Pokéball
    </ds-button>
  `,
};
