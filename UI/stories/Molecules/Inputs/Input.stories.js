import {
    MSinglelineHtml,
    MSinglelineNumberHtml,
    MSinglelineDateHtml
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

export const MSingleline = {
    args: {
        PreLabel: '',
        PostLabel: ''
    },
    render: (args) => MSinglelineHtml(args),
};
MSingleline.storyName = '<m-singleline-text>';

export const MSinglelineNumber = {
    args: {
        PreLabel: '',
        PostLabel: '',
        Step:''
    },
    render: (args) => MSinglelineNumberHtml(args),
};
MSinglelineNumber.storyName = '<m-singleline-number>';

