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
        maxlength: {
            control: 'number',
            description: 'Longest string allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
            },
        },
        'text-align': {
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
        minimumDate: {
            control: 'date',
            description: 'Earliest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions',
            },
        },
        maximumDate: {
            control: 'date',
            description: 'Last acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions',
            },
        },
    },
} as Meta;

type Singleline = StoryObj<typeof InputStories.ASingleline>;
export const Singleline: Singleline = {
    parameters: {
        controls: { include: ['text-align', 'width', 'maxlength'] },
    },
    args: {
        type: 'text',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type SinglelineNumber = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineNumber: SinglelineNumber = {
    parameters: {
        controls: { include: ['text-align', 'width', 'minimum', 'maximum'] },
    },
    args: {
        type: 'number',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type SinglelineDate = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineDate: SinglelineDate = {
    parameters: {
        controls: {
            include: ['text-align', 'width', 'minimumDate', 'maximumDate'],
        },
    },
    args: {
        type: 'date',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type SinglelineRange = StoryObj<typeof InputStories.ASingleline>;
export const SinglelineRange: SinglelineRange = {
    parameters: {
        controls: {
            include: ['width', 'minimum', 'maximum'],
        },
    },
    args: {
        type: 'range',
    },
    render: (args: object): HTMLInputElement => InputStories.ASingleline(args),
};

type Multiline = StoryObj<typeof InputStories.AMultiline>;
export const Multiline: Multiline = {
    parameters: {
        controls: {
            include: ['text-align', 'width'],
        },
    },
    render: (args: object): HTMLTextAreaElement =>
        InputStories.AMultiline(args),
};
