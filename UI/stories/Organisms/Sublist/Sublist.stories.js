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
                category: 'Balanced layout',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        MinWidth: {
            control: 'text',
            description: 'The minimum width of items in a balanced layout.',
            table: {
                category: 'Balanced layout',
                type: { summary: 'em/px' },
                defaultValue: { summary: '0' },
            },
        },
        OneSize: {
            control: 'boolean',
            description: 'Make all controls the same height and width.',
            table: {
                category: 'Size matching',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'false' },
            },
        },
        MaxWidth: {
            control: 'number',
            description: 'The maximum width of items when onesize is true.',
            table: {
                category: 'Size matching',
                type: { summary: 'px' },
                defaultValue: { summary: '0' },
            },
        },
    },
};

export const Sublist = {
    args: {
        Balance: 'false',
        MinWidth: '',
        OneSize: 'false',
        MaxWidth: '',
    },
    render: (args) => SublistHtml(args),
};
Sublist.storyName = 'o-option-sublist';
