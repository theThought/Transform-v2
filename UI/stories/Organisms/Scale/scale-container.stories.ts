import { Meta, StoryObj } from '@storybook/web-components-vite';
import OScaleContainer from '../../../src/javascript/web-components/o-scale-container';

if (!customElements.get('o-scale-container')) {
    customElements.define('o-scale-container', OScaleContainer);
}

export default {
    title: 'Organisms/scale',
    component: "o-scale-container",
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
} as Meta;

type StoryTen = StoryObj<typeof OScaleContainer>;
export const TenPoint: StoryTen = {
    name: '10-point container',
    args: {
        minimum: 1,
        maximum: 10,
    },
    render: (args) => {
        // Create a new instance of the OScaleContainer using document.createElement
        const scaleContainer: OScaleContainer = document.createElement('o-scale-container');
        scaleContainer.minimum = args.minimum;
        scaleContainer.maximum = args.maximum;
        scaleContainer.render();
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
        // Create a new instance of the OScaleContainer using document.createElement
        const scaleContainer: OScaleContainer = document.createElement('o-scale-container')
        scaleContainer.minimum = args.minimum;
        scaleContainer.maximum = args.maximum;

        scaleContainer.render();
        return scaleContainer;
    },
};
