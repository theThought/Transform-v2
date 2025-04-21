import { Meta, StoryObj } from '@storybook/web-components';
import * as LabelStories from './Label';

export default {
    title: 'Atoms/Labels',
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
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
        questionlabel: {
            control: 'text',
            description: 'The question being asked',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: 'This is the question being asked' },
            },
        },
        optionlabel: {
            control: 'text',
            description: 'The text describing the choice',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: 'option text' },
            },
        },
        sublistlabel: {
            control: 'text',
            description: 'The heading for a sublist',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: 'SubList' },
            },
        },
        thumblabel: {
            control: 'number',
            description: 'The current value for a slider',
            table: {
                type: { summary: 'number' },
                category: 'other',
                defaultValue: { summary: '10' },
            },
        },
    },
    args: { // Moved args to the root level
        prelabel: 'before',
        postlabel: 'after',
        questionlabel: 'This is the question being asked',
        optionlabel: 'option text',
        sublistlabel: 'SubList',
        thumblabel: 10,
    },
} as Meta;

type PreLabel = StoryObj<typeof LabelStories.ALabelPre>;
export const PreLabel = {
    parameters: {
        controls: { include: ['prelabel'] }, // Fixed syntax error
    },
    render: (args) => LabelStories.ALabelPre(args.prelabel),
};

type PostLabel = StoryObj<typeof LabelStories.ALabelPost>;
export const PostLabel = {
    parameters: {
        controls: { include: ['postlabel'] }, // Added include for postlabel
    },
    render: (args) => LabelStories.ALabelPost(args.postlabel),
    argTypes: {
        postlabel: { control: 'text' }, // Only include postlabel
    },
};

type QuestionLabel = StoryObj<typeof LabelStories.ALabelQuestion>;
export const QuestionLabel: QuestionLabel = {
    parameters: {
        controls: { include: ['questionlabel'] }, // Fixed syntax error
    },
    render: (args) => LabelStories.ALabelQuestion(args.questionlabel),
    argTypes: {
        questionlabel: { control: 'text' }, // Only include questionlabel
    },
};

type OptionLabel = StoryObj<typeof LabelStories.ALabelOption>;
export const OptionLabel: OptionLabel = {
    parameters: {
        controls: { include: ['optionlabel'] }, // Fixed syntax error
    },
    render: (args) => LabelStories.ALabelOption(args.optionlabel),
    argTypes: {
        optionlabel: { control: 'text' }, // Only include optionlabel
    },
};

type HeadingSublistLabel = StoryObj<typeof LabelStories.ALabelHeadingSublist>;
export const HeadingSublistLabel: HeadingSublistLabel = {
    parameters: {
        controls: { include: ['sublistlabel'] }, // Fixed syntax error
    },
    render: (args) => LabelStories.ALabelHeadingSublist(args.sublistlabel),
    argTypes: {
        sublistlabel: { control: 'text' }, // Only include sublistlabel
    },
};
