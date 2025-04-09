import { Meta, StoryObj } from '@storybook/blocks';
import { MLabelPrePost } from './prepost';

const meta: Meta = {
    title: 'Molecules/Labels/prepost',
    tags: ['autodocs'],
    parameters: {
      status: { type: 'beta' },
      controls: { sort: 'alpha' },
      docs: { controls: { sort: 'alpha' } },
    }
  };

export default meta;

type PrePostLabel = StoryObj<typeof MLabelPrePost>;
export const PrePostLabel: PrePost = {
  render: () => MLabelPrePost(),
};