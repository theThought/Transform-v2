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

type Pre = StoryObj; 

export const PreLabel: Pre = {
  args: {
    content: '',
  },
  render: (args) => ALabelPre(args.content),
};