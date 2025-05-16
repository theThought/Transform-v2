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
                defaultValue: { summary: '1' },
                order: 1, // Ensure minimum appears before maximum
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions', // Ensure this matches "minimum"
                defaultValue: { summary: '100' },
                order: 2, // Ensure maximum appears after minimum
            },
        },
        align: {
            control: 'select',
            options: ['left', 'right', 'center'],
            description: 'Alignment of the content within the input',
            table: {
                type: { summary: 'string' },
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
                order: 1, // Ensure minimumDate appears before maximumDate
            },
        },
        maximumDate: {
            control: 'date',
            description: 'latest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions', // Ensure this matches "minimum"
                order: 2, // Ensure maximumDate appears after minimumDate
            },
        },
    },
} as Meta;

type Singleline = StoryObj<typeof InputStories.ASingleline>;
export const Singleline: Singleline = {
    parameters: {
        controls: { include: ['align', 'width'] },
    },
    args: {
        type: 'text',
        minimum: 1,
        maximum: 40,
        align: 'left',
        width: '15em',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type SinglelineNumber = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineNumber: SinglelineNumber = {
    parameters: {
        controls: { include: ['align', 'width', 'minimum', 'maximum', 'step'] },
    },
    args: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        align: 'right',
        width: '8em',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type SinglelineDate = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineDate: SinglelineDate = {
    parameters: {
        controls: { include: ['align', 'width', 'minimumDate', 'maximumDate'] },
    },
    args: {
        type: 'date',
        width: '10em',
        align: 'left',
        minimumDate: ((): string => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })(),
        maximumDate: ((): string => {
            const tenDaysFromNow = new Date();
            tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
            return tenDaysFromNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })(),
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type SinglelineRange = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineRange: SinglelineRange = {
    parameters: {
        controls: {
            include: ['width', 'minimum', 'maximum', 'step'],
        }, // Fixed syntax error
    },
    args: {
        type: 'range',
        minimum: 1,
        maximum: 15,
        width: '20em',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type Multiline = StoryObj<typeof InputStories.AMultiline>;
export const Multiline: Multiline = {
    parameters: {
        controls: {
            include: ['align', 'width'],
        }, // Fixed syntax error
    },
    args: {
        width: '20em',
        align: 'left',
    },
    render: (args: object): HTMLTextAreaElement =>
        InputStories.AMultiline(args),
};
