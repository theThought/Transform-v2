import { StoryObj } from '@storybook/blocks';
import OScaleContainer from '../../../src/javascript/web-components/o-scale-container';

export default {
    title: 'Organisms/Scale Container',
    component: OScaleContainer,
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

type StoryTen = StoryObj<typeof OScaleContainer>;
export const TenPoint: StoryTen = {
    name: '10-point container',
    args: {
        minimum: 1,
        maximum: 10,
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleContainer = new OScaleContainer();
        scaleContainer.minimum = args.minimum;
        scaleContainer.maximum = args.maximum;
        return scaleContainer;
    },
};

type StorySeven = StoryObj<typeof OScaleContainer>;
export const SevenPoint: StorySeven = {
    name: '7-point container',
    args: {
        minimum: 1,
        maximum: 7,
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleContainer = new OScaleContainer();
        scaleContainer.minimum = args.minimum;
        scaleContainer.maximum = args.maximum;
        return scaleContainer;
    },
};
