import { Meta, StoryObj } from '@storybook/blocks';
import { ALabelPre } from './Label';

const meta: Meta = {
  title: 'Atoms/Labels',
  tags: ['autodocs'],
  parameters: {
    status: { type: 'beta' },
    controls: { sort: 'alpha' },
    docs: { controls: { sort: 'alpha' } },
  },
};

export default meta;

type PreLabel = StoryObj<typeof ALabelPre>;
export const PreLabel: Pre = {
  args: {
    content: 'prelabel',
  },
  render: (args) => ALabelPre(args.content),
};