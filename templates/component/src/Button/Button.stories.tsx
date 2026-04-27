import React from 'react';
import type { ComponentMeta } from '@storybook/react';
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: { type: 'boolean' } },
    block: { control: { type: 'boolean' } },
  },
} as ComponentMeta<typeof Button>;

export const Primary = (args: React.ComponentProps<typeof Button>) => (
  <Button {...args}>Primary Button</Button>
);

export const Secondary = (args: React.ComponentProps<typeof Button>) => (
  <Button {...args} variant="secondary">Secondary Button</Button>
);

export const Outline = (args: React.ComponentProps<typeof Button>) => (
  <Button {...args} variant="outline">Outline Button</Button>
);

export const Block = (args: React.ComponentProps<typeof Button>) => (
  <Button {...args} block>Block Button</Button>
);
