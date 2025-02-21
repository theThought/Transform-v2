import {
    MInputSinglelineHtml,
    MInputSinglelineNumberHtml,
    MInputSinglelineDateHtml
} from './Input';

export default {
    title: 'Molecules/Inputs',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
    argTypes: {
        PreLabel: {
            control: 'text',
            description: 'Specifies the text to be placed before the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' }
            },
        },
        PostLabel: {
            control: 'text',
            description: 'Specifies the text to be placed after the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' }
            },
        },
    }
};

export const MInputSingleline = {
    args: {
        PreLabel: '',
        PostLabel: ''
    },
    render: (args) => MInputSinglelineHtml(args),
};
MInputSingleline.storyName = '<m-input-singleline>';

export const MInputSinglelineNumber = {
    args: {
        PreLabel: '',
        PostLabel: ''
    },
    render: (args) => MInputSinglelineNumberHtml(args),
};
MInputSinglelineNumber.storyName = '<m-input-singleline-number>';

export const MInputSinglelineDate = {
    args: {
        PreLabel: '',
        PostLabel: ''
    },
    render: (args) => MInputSinglelineDateHtml(args),
};
MInputSinglelineDate.storyName = '<m-input-singleline-date>';
