import { Meta, StoryObj } from '@storybook/blocks';
import MScaleContainer, { ScaleContainerHtml } from './scale-container';

customElements.define('m-scale-container', MScaleContainer);

const meta: Meta= {
    title: 'Organisms/scale-container',
    component: MScaleContainer,
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        minimum: {
            control: 'number',
            description: 'the smallest value in the scale.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' },
            },
        },
        maximum: {
            control: 'number',
            description: 'the largest value in the scale.',
            table: {
                type: { summary: 'number' },
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof MScaleContainer>;
export const Default: Story = {
  args: {
    minimum: 1,
    maximum: 10,
  },
  render: (args) => {
    // Create a new instance of the MScaleUnit class
    const scaleContainer = new MScaleContainer();
    scaleContainer.minimum = args.minimum;
    scaleContainer.maximum = args.maximum;
    return scaleContainer;
  },
};