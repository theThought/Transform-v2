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
                subcategory: 'input',
                defaultValue: { summary: '1' },
                order: 1, // Ensure minimum appears before maximum
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                subcategory: 'input',
                defaultValue: { summary: '100' },
                order: 2, // Ensure maximum appears after minimum
            },
        },
        width: {
            control: 'text',
            description:
                'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 3,
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
        prelabel: {
            control: 'text',
            description: 'A string placed BEFORE the input',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels',
                defaultValue: { summary: 'before' },
                order: 1,
            },
        },
        postlabel: {
            control: 'text',
            description: 'A string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels',
                defaultValue: { summary: 'after' },
                order: 2,
            },
        },
    },
} as Meta;

type ScaleStory = StoryObj<typeof OScale_Story>;

export const TenPointScale: ScaleStory = {
    parameters: {
        controls: {
            exclude: ['orientation'],
        }, // Fixed syntax error
    },
    name: '10-point scale',
    args: {
        minimum: 1,
        maximum: 10,
        width: '100%',
        prelabel: 'Before',
        postlabel: 'After',
        orientation: 'horizontal',
    },
    render: (args) => OScale_Story(args),
};

export const SevenPointScale: ScaleStory = {
    parameters: {
        controls: {
            exclude: ['orientation'],
        }, // Fixed syntax error
    },
    name: '7-point scale',
    args: {
        minimum: 1,
        maximum: 7,
        width: '100%',
        prelabel: 'Before',
        postlabel: 'After',
        orientation: 'horizontal',
    },
    render: (args) => OScale_Story(args),
};
