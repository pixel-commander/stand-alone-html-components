import type { Meta, StoryObj } from '@storybook/react-vite';

import { ImageUpload } from './image-upload';

const meta: Meta<typeof ImageUpload> = {
  component: ImageUpload,
  title: 'ImageUpload',
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {};

export const Playground: Story = {
  args: {
    data: [],
  },
};
