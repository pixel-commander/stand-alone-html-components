import type { Meta, StoryObj } from '@storybook/react-vite';

import { CdsComponentName } from './component-name';

const ROWS = [{ id: 'ID 1' }, { id: 'ID 2' }, { id: 'ID 3' }];

const meta: Meta<typeof CdsComponentName> = {
  component: CdsComponentName,
  title: 'ComponentName',
  args: {
    data: ROWS,
  },
};

export default meta;
type Story = StoryObj<typeof CdsComponentName>;

export const Default: Story = {};

export const NoData: Story = {
  args: {
    data: [],
  },
};

export const Playground: Story = {
  args: {
    data: ROWS,
    className: '',
  },
};
