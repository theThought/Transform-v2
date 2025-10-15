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
            },
        },
        postlabel: {
            control: 'text',
            description: 'A string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
                subcategory: 'labels',
            },
        },
        questionlabel: {
            control: 'text',
            description: 'The question being asked',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        optionlabel: {
            control: 'text',
            description: 'The text describing the choice',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        sublistlabel: {
            control: 'text',
            description: 'The heading for a sublist',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        thumblabel: {
            control: 'number',
            description: 'The current value for a slider',
            table: {
                type: { summary: 'number' },
                category: 'other',
            },
        },
        marklabel: {
            control: 'number',
            description: 'A label for a scale data-mark',
            table: {
                type: { summary: 'number' },
                category: 'other',
            },
        },
        scalelabel: {
            control: 'text',
            description: 'A string placed at either end of a scale',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
                subcategory: 'labels',
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
        scalelabel: 'Scale label',
    },
} as Meta;

export const PreLabel = {
    parameters: {
        controls: { include: ['prelabel'] },
    },
    render: (args) => LabelStories.ALabelPreBoxed(args.prelabel),
};

export const PostLabel = {
    args: {
        postlabel: 'after',
    },
    parameters: {
        controls: { include: ['postlabel'] }, // Added include for postlabel
    },
    render: (args) => LabelStories.ALabelPostBoxed(args.postlabel),
};

export const QuestionLabel = {
    args: {
        questionlabel: 'This is the question being asked',
    },
    parameters: {
        controls: { include: ['questionlabel'] },
    },
    render: (args) => LabelStories.ALabelQuestion(args.questionlabel),
};

export const OptionLabel = {
    args: {
        optionlabel: 'option text',
    },
    parameters: {
        controls: { include: ['optionlabel'] },
    },
    render: (args) => LabelStories.ALabelOption(args.optionlabel),
};

export const HeadingSublistLabel = {
    args: {
        sublistlabel: 'SubList Heading',
    },
    parameters: {
        controls: { include: ['sublistlabel'] },
    },
    render: (args) => LabelStories.ALabelHeadingSublist(args.sublistlabel),
};

export const ThumbLabel = {
    args: {
        postlabel: '5',
    },
    parameters: {
        controls: { include: ['thumblabel'] },
    },
    render: (args) => LabelStories.ALabelThumb(args.thumblabel),
};

export const MarkLabel = {
    args: {
        marklabel: 10,
    },
    parameters: {
        controls: { include: ['marklabel'] },
    },
    render: (args) => LabelStories.ALabelMark(args.marklabel),
};

export const ScaleLabel = {
    args: {
        scalelabel: 'Scale label',
    },
    parameters: {
        controls: { include: ['prelabel'] },
    },
    render: (args) => LabelStories.ALabelScale(args.scalelabel),
};
