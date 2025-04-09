import { Meta, StoryObj } from '@storybook/blocks';
import OScale from './scale';

customElements.define('o-scale', OScale);

const meta: Meta= {
    title: 'Organisms/scale',
    component: OScale,
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

type ScaleTen = StoryObj<typeof OScale>;
export const Default: ScaleTen = {
    name: '10-point scale',
    args: {
        minimum: 1,
        maximum: 10,
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleContainer = new OScale();
        return scaleContainer;
    },
};