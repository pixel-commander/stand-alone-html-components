import type { Meta, StoryObj } from '@storybook/react-vite';

import { ColoredStateTiles } from './colored-state-tiles';

const meta: Meta<typeof ColoredStateTiles> = {
  component: ColoredStateTiles,
  title: 'ColoredStateTiles',
};

export default meta;
type Story = StoryObj<typeof ColoredStateTiles>;

export const Default: Story = {};

export const Playground: Story = {
  args: {
    data: [],
  },
};
