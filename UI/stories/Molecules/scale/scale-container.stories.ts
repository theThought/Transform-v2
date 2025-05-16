import { Meta, StoryObj } from '@storybook/web-components';
import { MScaleContainer_Story } from './scale-container';

export default {
    title: 'Molecules/Scale',
    component: 'm-scale-container', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        minimum: {
            control: 'number',
            description: 'Smallest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
            },
        },
        width: {
            control: 'text',
            description:
                'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Orientation of the scale',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
    },
} as Meta;

type TenContainer = StoryObj<typeof MScaleContainer_Story>;
export const TenPointContainer: TenContainer = {
    parameters: {
        controls: {
            exclude: ['orientation'],
        }, // Fixed syntax error
    },
    args: {
        minimum: 1,
        maximum: 10,
        orientation: 'horizontal',
    },
    render: (args) => MScaleContainer_Story(args),
};
TenPointContainer.storyName = 'Ten point scale';

type SevenContainer = StoryObj<typeof MScaleContainer_Story>;
export const SevenPointContainer: SevenContainer = {
    parameters: {
        controls: {
            exclude: ['orientation'],
        }, // Fixed syntax error
    },
    args: {
        minimum: 1,
        maximum: 7,
        width: '35em',
        orientation: 'horizontal',
    },
    render: (args) => MScaleContainer_Story(args),
};
SevenPointContainer.storyName = 'Seven point scale';
