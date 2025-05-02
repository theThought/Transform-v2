import { Meta, StoryObj } from '@storybook/web-components';
import * as SingleLineStories from './Singleline';

type Story = StoryObj;

export default {
    title: 'Molecules/Singleline',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        prelabel: {
            control: 'text',
            description: 'Specifies the text to be placed before the input.',
            table: {
                type: { summary: 'text' },
                category: 'Properties',
                subCategory: 'Labels',
                defaultValue: { summary: 'n/a' },
                order: 1,
            },
        },
        postlabel: {
            control: 'text',
            description: 'Specifies the text to be placed after the input.',
            table: {
                type: { summary: 'text' },
                category: 'Properties',
                subCategory: 'Labels',
                defaultValue: { summary: 'n/a' },
                order: 2,
            },
        },
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
                order: 1,
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions', // Ensure this matches "minimum"
                subcategory: 'input', // Ensure this matches "minimum"
                defaultValue: { summary: '100' },
                order: 2,
            },
        },
        align: {
            control: 'select',
            options: ['Left', 'Right', 'Center'],
            description: 'Alignment of the content within the input',
            table: {
                type: { summary: 'string' },
                category: 'parameters',
            },
        },
        width: {
            control: 'text',
            description:
                'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'string' },
                category: 'parameters',
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
                order: 1,
            },
        },
        maximumDate: {
            control: 'date',
            description: 'latest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions', // Ensure this matches "minimum"
                subcategory: 'input', // Ensure this matches "minimum"
                order: 2,
            },
        },
    },
};

type Singleline = StoryObj<typeof SingleLineStories.MSingleLine_Story>;
export const Singleline = {
    parameters: {
        controls: {
            include: [
                'align',
                'width',
                'minimum',
                'maximum',
                'prelabel',
                'postlabel',
            ],
        }, // Fixed syntax error
    },
    args: {
        type: 'text',
        minimum: 1,
        maximum: 40,
        prelabel: 'before',
        postlabel: 'after',
        align: 'Left',
        width: '100%',
    },
    render: (args) => SingleLineStories.MSingleLine_Story(args),
};

type SinglelineNumber = StoryObj<typeof SingleLineStories.MSingleLine_Story>;
export const SinglelineNumber = {
    parameters: {
        controls: {
            include: [
                'align',
                'width',
                'minimum',
                'maximum',
                'step',
                ,
                'prelabel',
                'postlabel',
            ],
        }, // Fixed syntax error
    },
    args: {
        type: 'number',
        minimum: 1,
        maximum: 40,
        prelabel: 'before',
        postlabel: 'after',
        align: 'Left',
        width: '100%',
    },
    render: (args) => SingleLineStories.MSingleLine_Story(args),
};

type SinglelineDate = StoryObj<typeof SingleLineStories.MSingleLine_Story>;
export const SinglelineDate = {
    parameters: {
        controls: {
            include: [
                'align',
                'width',
                'minimumDate',
                'maximumDate',
                'prelabel',
                'postlabel',
            ],
        }, // Fixed syntax error
    },
    args: {
        type: 'date',
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
        prelabel: 'before',
        postlabel: 'after',
        align: 'Left',
        width: '100%',
    },
    render: (args) => SingleLineStories.MSingleLine_Story(args),
};
