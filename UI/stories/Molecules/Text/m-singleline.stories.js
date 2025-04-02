import {
    SinglelineHtml,
    SinglelineNumberHtml,
    SinglelineDateHtml,
} from './singleline';

export default {
    title: 'Molecules/Text',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        PreLabel: {
            control: 'text',
            description: 'Specifies the text to be placed before the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        PostLabel: {
            control: 'text',
            description: 'Specifies the text to be placed after the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        min: {
            control: 'number',
            description: 'Specifies the minimum value for a number input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '' },
            },
        },
        max: {
            control: 'number',
            description: 'Specifies the maximum value for a number input.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '' },
            },
        },
        step: {
            control: 'text',
            description: 'Specifies the step interval for a number input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'any' },
            },
        },
    },
};

export const MSingleline = {
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => SinglelineHtml(args),
};
MSingleline.storyName = 'm-singleline';

export const MSinglelineNumber = {
    args: {
        PreLabel: '',
        PostLabel: '',
        min: '',
        max: '',
        step: '',
    },
    render: (args) => SinglelineNumberHtml(args),
};
MSinglelineNumber.storyName = 'm-singleline-number';

export const MSinglelineDate = {
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => SinglelineDateHtml(args),
};
MSinglelineDate.storyName = 'm-singleline-date';
