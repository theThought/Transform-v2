import { Meta, StoryObj } from '@storybook/web-components';
import * as InputStories from './Input';

export default {
    title: 'Atoms/Inputs',
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'number', 'range', 'number', 'date'],
            description: 'Type of input required',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                subcategory: 'input',
                defaultValue: { summary: 'text' },
            },
        },
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
                category: 'Dimensions', // Ensure this matches "minimum"
                subcategory: 'input',  // Ensure this matches "minimum"
                defaultValue: { summary: '100' },
            },
        },
        align: {
            control: 'select',
            options: ['Left', 'Right', 'Center'],
            description: 'Alignment of the content within the input',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
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
        hidden: {
            control: 'boolean',
            description: 'Is the input hidden?',
            table: {
                type: { summary: 'string' },
                category: 'Internal',
            },
        },
        step: {
            control: 'number',
            description: 'Precision of the input',
            table: {
                type: { summary: 'number' },
                category: 'Properties',
                defaultValue: { summary: '1' },
            },
        },
        minimumDate: {
            control: 'date',
            description: 'Earliest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions',
                subcategory: 'input',
            },
        },
        maximumDate: {
            control: 'date',
            description: 'latest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions', // Ensure this matches "minimum"
                subcategory: 'input', // Ensure this matches "minimum"
            },
        },
    },
} as Meta;


type Singleline = StoryObj<typeof InputStories.ASingleline>;
export const Singleline = {
    parameters: {
        controls: { include: ['align', 'width', 'minimum', 'maximum'] }, // Fixed syntax error
    },
    args: {
        type: 'text',
        minimum: 1,
        maximum: 40,
        align: 'Left',
        width: '15em',
    },
    render: (args) => InputStories.ASingleline(args),
};

type SinglelineNumber = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineNumber = {
    parameters: {
        controls: { include: ['align', 'width', 'minimum', 'maximum', 'step'] }, // Fixed syntax error
    },
    args: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        align: 'Right',
        width: '4em',
    },
    render: (args) => InputStories.ASingleline(args),
};

type SinglelineDate = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineDate = {
    parameters: {
        controls: { include: ['align', 'width', 'minimumDate', 'maximumDate'] }, // Fixed syntax error
    },
    args: {
        type: 'date',
        width: '10em',
        align: 'left',
        minimumDate: (() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })(),
        maximumDate: (() => {
            const tenDaysFromNow = new Date();
            tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
            return tenDaysFromNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })(),
    },
    render: (args) => InputStories.ASingleline(args),
};

type SinglelineRange = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineRange = {
    parameters: {
        controls: { include: ['type', 'align', 'width', 'minimum', 'maximum'] }, // Fixed syntax error
    },
    args: {
        type: 'range',
        minimum: 1,
        maximum: 15,
        width: '20em',
        align: 'Left',
    },
    render: (args) => InputStories.ASingleline(args),
};