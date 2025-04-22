import { Meta, StoryObj } from '@storybook/web-components';
import { OScale_Story } from './scale';

export default {
    title: 'Organisms/scale',
    component: "o-scale",
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
            },
        },
        width: {
            control: 'text',
            description: 'Input width using a value and a measurement (e.g., px, em, %)',
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
            },
        },
    },
} as Meta;

type ScaleStory = StoryObj<typeof OScale_Story>;

export const TenPointScale: ScaleStory = {
    name: '10-point scale',
    args: {
        minimum: 1,
        maximum: 10,
        width: '15em',
        prelabel: 'Before',
        postlabel: 'After',
    },
    render: (args) => OScale_Story(args),
};

export const SevenPointScale: ScaleStory = {
    name: '7-point scale',
    args: {
        minimum: 1,
        maximum: 7,
        width: '10em',
        prelabel: 'Before',
        postlabel: 'After',
    },
    render: (args) => OScale_Story(args),
};
