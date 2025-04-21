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
                category: 'parameters',
            },
        },
        width: {
            control: 'text',
            description: 'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'string' },
                category: 'parameters',
            },
        },
    },
};

type Singleline = StoryObj<typeof SingleLineStories.MSingleLine_Story>;
export const Singleline = {

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
