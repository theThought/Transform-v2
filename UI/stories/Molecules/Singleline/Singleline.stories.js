import {
    SinglelineHtml,
    SinglelineNumberHtml,
    SinglelineDateHtml,
} from './Singleline';

export default {
    title: 'Molecules/Singleline',
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
    argTypes: {
        StepInterval: {
            control: 'text',
            description: 'Specifies the step interval for a number input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'any' },
            },
        },
    },
    args: {
        PreLabel: '',
        PostLabel: '',
        StepInterval: '',
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
