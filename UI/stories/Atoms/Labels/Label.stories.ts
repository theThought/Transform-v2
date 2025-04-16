import type { StoryObj } from '@storybook/html';
import * as LabelStories from './Label';

export default {
    title: 'Atoms/Labels',
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
};

export const PreLabel = {
    args: {
        content: 'prelabel',
    },
    render: (args) => LabelStories.ALabelPre(args),
};

export const PostLabel = {
    args: {
        content: 'postlabel',
    },
    render: (args) => LabelStories.ALabelPost(args),
};

type QuestionLabel = StoryObj<typeof ALabelQuestion>;
export const QuestionLabel: Question = {
    args: {
        content: 'This is the question',
    },
    render: (args) => LabelStories.ALabelQuestion(args.content),
};

type OptionLabel = StoryObj<typeof ALabelOption>;
export const OptionLabel: Option = {
    args: {
        content: 'This is the option',
    },
    render: (args) => LabelStories.ALabelOption(args.content),
};

type HeadingSublistLabel = StoryObj<typeof ALabelHeadingSublist>;
export const HeadingSublistLabel: HeadingSublist = {
    args: {
        content: 'sublist heading',
    },
    render: (args) => LabelStories.ALabelHeadingSublist(args.content),
};
