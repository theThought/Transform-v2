import { Meta, StoryObj } from '@storybook/blocks';
import {
    ALabelPre,
    ALabelPost,
    ALabelQuestion,
    ALabelOption,
    ALabelHeadingSublist,
} from './Label';

export default {
    title: 'Atoms/Labels',
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
};

type PreLabel = StoryObj<typeof ALabelPre>;
export const PreLabel: Pre = {
    args: {
        content: 'prelabel',
    },
    render: (args) => ALabelPre(args.content),
};

type PostLabel = StoryObj<typeof ALabelPost>;
export const PostLabel: Post = {
    args: {
        content: 'postlabel',
    },
    render: (args) => ALabelPost(args.content),
};

type QuestionLabel = StoryObj<typeof ALabelQuestion>;
export const QuestionLabel: Question = {
    args: {
        content: 'This is the question',
    },
    render: (args) => ALabelQuestion(args.content),
};

type OptionLabel = StoryObj<typeof ALabelOption>;
export const OptionLabel: Option = {
    args: {
        content: 'This is the option',
    },
    render: (args) => ALabelOption(args.content),
};

type HeadingSublistLabel = StoryObj<typeof ALabelHeadingSublist>;
export const HeadingSublistLabel: HeadingSublist = {
    args: {
        content: 'sublist heading',
    },
    render: (args) => ALabelHeadingSublist(args.content),
};
