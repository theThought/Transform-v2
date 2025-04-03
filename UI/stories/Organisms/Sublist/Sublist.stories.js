import { SublistHtml } from './Sublist';

export default {
    title: 'Organisms/Sublist',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
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

export const Sublist = {
    args: {
        Balance: '',
        MinWidth: '',
    },
    render: (args) => SublistHtml(args),
};
Sublist.storyName = 'o-option-sublist';
