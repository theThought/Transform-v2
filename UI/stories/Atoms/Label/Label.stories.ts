import { Meta, StoryObj } from '@storybook/web-components';
import * as LabelStories from './Label';

export default {
    title: 'Atoms/Label',
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
                category: 'Custom Properties',
                subcategory: 'labels',
                defaultValue: { summary: 'before' },
            },
        },
        postlabel: {
            control: 'text',
            description: 'A string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
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
    args: {
        prelabel: 'before',
        postlabel: 'after',
        questionlabel: 'This is the question being asked',
        optionlabel: 'option text',
        sublistlabel: 'SubList',
        thumblabel: 10,
    },
} as Meta;

export const PreLabel = {
    parameters: {
        controls: { include: ['prelabel'] },
    },
    render: (args) => LabelStories.ALabelPre(args.prelabel),
};

export const PostLabel = {
    parameters: {
        controls: { include: ['postlabel'] }, // Added include for postlabel
    },
    render: (args) => LabelStories.ALabelPost(args.postlabel),
};

export const QuestionLabel = {
    parameters: {
        controls: { include: ['questionlabel'] },
    },
    render: (args) => LabelStories.ALabelQuestion(args.questionlabel),
};

export const OptionLabel = {
    parameters: {
        controls: { include: ['optionlabel'] },
    },
    render: (args) => LabelStories.ALabelOption(args.optionlabel),
};

export const HeadingSublistLabel = {
    parameters: {
        controls: { include: ['sublistlabel'] },
    },
    render: (args) => LabelStories.ALabelHeadingSublist(args.sublistlabel),
};

export const ThumbLabel = {
    parameters: {
        controls: { include: ['thumblabel'] },
    },
    render: (args) => LabelStories.ALabelThumb(args.thumblabel),
};
