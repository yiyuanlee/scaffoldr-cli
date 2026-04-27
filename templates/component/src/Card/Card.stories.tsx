import React from 'react';
import type { ComponentMeta } from '@storybook/react';
import { Card } from './Card';

export default {
  title: 'Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

export const Default = () => (
  <Card title="Card Title">
    This is the card body content. It can contain any text, components, or elements.
  </Card>
);

export const WithFooter = () => (
  <Card
    title="Card Title"
    footer={<span>Footer content here</span>}
  >
    This card has a footer section.
  </Card>
);
