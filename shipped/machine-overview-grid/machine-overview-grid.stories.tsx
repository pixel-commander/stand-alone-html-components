import type { Meta, StoryObj } from '@storybook/react-vite';

import { MachineOverviewGrid } from './machine-overview-grid';

const meta: Meta<typeof MachineOverviewGrid> = {
  component: MachineOverviewGrid,
  title: 'MachineOverviewGrid',
};

export default meta;
type Story = StoryObj<typeof MachineOverviewGrid>;

export const Default: Story = {};

export const Playground: Story = {
  args: {
    data: [],
    icon: '',
    color: '',
    title: '',
    value: '',
  },
};
