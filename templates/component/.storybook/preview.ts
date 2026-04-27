import React from 'react';
import type { Preview } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import { withConsole } from '@storybook/addon-console';

addDecorator(withConsole());

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
