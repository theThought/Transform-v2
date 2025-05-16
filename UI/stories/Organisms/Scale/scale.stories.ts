import { Meta, StoryObj } from '@storybook/web-components';
import { OScale_Story } from './scale';

export default {
    title: 'Organisms/scale',
    component: 'o-scale',
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
        'properties.labels.pre': {
            control: 'text',
            name: 'labels.pre',
            description: 'A string placed BEFORE the input',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
            },
        },
        'properties.labels.post': {
            control: 'text',
            name: 'labels.post',
            description: 'A string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
            },
        },
    },
} as Meta;

type ScaleStory = StoryObj<typeof OScale_Story>;

export const TenPointScale: ScaleStory = {
    parameters: {
        controls: {
            exclude: ['orientation'],
        },
    },
    name: '10-point scale',
    args: {
        minimum: 1,
        maximum: 10,
        width: '100%',
        properties: {
            labels: {
                pre: 'Before',
                post: 'After',
            },
        },
        orientation: 'horizontal',
    },
    render: (args) => OScale_Story(args),
};

export const SevenPointScale: ScaleStory = {
    parameters: {
        controls: {
            exclude: ['orientation'],
        },
    },
    name: '7-point scale',
    args: {
        minimum: 1,
        maximum: 7,
        width: '100%',
        properties: {
            labels: {
                pre: 'Before',
                post: 'After',
            },
        },
        orientation: 'horizontal',
    },
    render: (args) => OScale_Story(args),
};
