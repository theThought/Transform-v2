import {
    MSinglelineHtml,
    MSinglelineNumberHtml,
    MSinglelineDateHtml,
} from './Input';

export default {
    title: 'Molecules/Inputs',
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

export const MSingleLine = {
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => MSinglelineHtml(args),
};
MSingleLine.storyName = '<m-singleline>';

export const MSinglelineNumber = {
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => MSinglelineNumberHtml(args),
};
MSinglelineNumber.storyName = '<m-singleline-number>';

export const MSinglelineDate = {
    args: {
        PreLabel: '',
        PostLabel: '',
        Step: '',
    },
    render: (args) => MSinglelineDateHtml(args),
};
MSinglelineDate.storyName = '<m-singleline-date>';
