import { Meta } from '@storybook/addon-docs';
import { createLabelPre } from './Label';

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

type Pre = StoryObj: <typeof MScaleUnit>; 

export const PreLabel: Pre = {
  args: {
    content: '',
  },
  render: (args) => createLabelPre(args.content),
};