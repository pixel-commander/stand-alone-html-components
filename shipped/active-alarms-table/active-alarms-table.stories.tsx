import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActiveAlarmsTable } from './active-alarms-table';

const meta: Meta<typeof ActiveAlarmsTable> = {
  component: ActiveAlarmsTable,
  title: 'ActiveAlarmsTable',
};

export default meta;
type Story = StoryObj<typeof ActiveAlarmsTable>;

export const Default: Story = {};

export const Playground: Story = {
  args: {
    data: [],
    Icon: 'icons/bell.svg',
    link_text: 'Open Issue',
  },
};
