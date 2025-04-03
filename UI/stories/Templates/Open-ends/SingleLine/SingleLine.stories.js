import { SingleLineSpecialCodesHtml } from './SingleLine';

export default {
    title: 'Templates/Open-ends/t-singleline',
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
        Balance: {
            control: 'boolean',
            description: 'Places options in a horizontal layout.',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        MinWidth: {
            control: 'text',
            description: 'The minimum width of items in a balanced layout.',
            table: {
                type: { summary: 'em/px' },
                defaultValue: { summary: '0' },
            },
        },
    },
};

export const SingleLineSpecialCodesStories = {
    args: {
        PreLabel: '',
        PostLabel: '',
        Balance: '',
        MinWidth: '',
    },
    render: (args) => SingleLineSpecialCodesHtml(args),
};
