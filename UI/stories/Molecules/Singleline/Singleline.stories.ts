import { Meta, StoryObj } from '@storybook/web-components';
import * as SingleLineStories from './Singleline';

export default {
    title: 'Molecules/Singleline',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        placeholder: {
            control: 'text',
            description:
                'A short hint that describes the expected value of an input field',
            table: {
                type: { summary: 'text' },
                category: 'Dimensions',
                defaultValue: { summary: 'Enter text' },
            },
        },
        'properties.labels.pre': {
            control: 'text',
            name: 'pre',
            description: 'Specifies the text to be placed before the input',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
                subcategory: 'Labels',
            },
        },
        'properties.labels.post': {
            control: 'text',
            name: 'post',
            description: 'Specifies the text to be placed after the input',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
                subcategory: 'Labels',
            },
        },
        'properties.paste': {
            control: 'boolean',
            name: 'paste',
            description: 'Allows pasting of text',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                defaultValue: { summary: 'false' },
            },
        },
        type: {
            control: 'select',
            options: ['text', 'number', 'range', 'number', 'date'],
            description: 'Type of input required',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
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
                category: 'Dimensions', // Ensure this matches "minimum"
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
        'properties.step': {
            control: 'number',
            name: 'step',
            description: 'Precision of the input',
            table: {
                type: { summary: 'number' },
                category: 'Custom Properties',
                defaultValue: { summary: '1' },
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
            description: 'latest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions',
            },
        },
    },
} as Meta;

type Singleline = StoryObj<typeof SingleLineStories.MSingleLine_Story>;
export const Singleline: Singleline = {
    parameters: {
        controls: {
            include: [
                'text-align',
                'width',
                'maxlength',
                'pre',
                'post',
                'paste',
                'placeholder',
            ],
        },
    },
    args: {
        type: 'text',
        properties: {
            labels: {
                pre: 'before',
                post: 'after',
            },
            paste: false,
        },
    },
    render: (args: object): HTMLElement =>
        SingleLineStories.MSingleLine_Story(args),
};

type SinglelineNumber = StoryObj<
    typeof SingleLineStories.MSingleLineNumber_Story
>;
export const SinglelineNumber: SinglelineNumber = {
    parameters: {
        controls: {
            include: [
                'text-align',
                'width',
                'minimum',
                'maximum',
                'step',
                'pre',
                'post',
                'paste',
                'placeholder',
            ],
        },
    },
    args: {
        type: 'number',
        properties: {
            step: '',
            labels: {
                pre: 'before',
                post: 'after',
            },
            paste: false,
        },
    },
    render: (args: object): HTMLElement =>
        SingleLineStories.MSingleLineNumber_Story(args),
};

type SinglelineDate = StoryObj<typeof SingleLineStories.MSingleLineDate_Story>;
export const SinglelineDate: SinglelineDate = {
    parameters: {
        controls: {
            include: [
                'text-align',
                'width',
                'minimumDate',
                'maximumDate',
                'pre',
                'post',
                'paste',
                'placeholder',
            ],
        },
    },
    args: {
        type: 'date',
        properties: {
            labels: {
                pre: 'before',
                post: 'after',
            },
            paste: false,
        },
    },
    render: (args: object): HTMLElement =>
        SingleLineStories.MSingleLineDate_Story(args),
};
