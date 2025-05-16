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
        'properties.labels.pre': {
            control: 'text',
            name: 'labels.pre',
            description: 'Specifies the text to be placed before the input',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
            },
        },
        'properties.labels.post': {
            control: 'text',
            name: 'labels.post',
            description: 'Specifies the text to be placed after the input',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
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
                'labels.pre',
                'labels.post',
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
                'labels.pre',
                'labels.post',
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
                'labels.pre',
                'labels.post',
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
        },
    },
    render: (args: object): HTMLElement =>
        SingleLineStories.MSingleLineDate_Story(args),
};
