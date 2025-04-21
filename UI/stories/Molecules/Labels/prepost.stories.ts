import { Meta, StoryObj } from '@storybook/web-components';
import { MLabelPrePost } from './prepost';

const meta: Meta = {
    title: 'Molecules/Labels/prepost',
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        prelabel: {
            control: 'text',
            description: 'A string placed BEFORE the input',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels',
                defaultValue: { summary: 'before' },
            },
        },
        postlabel: {
            control: 'text',
            description: 'A string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels',
                defaultValue: { summary: 'after' },
            },
        },
        thumblabel: {
            control: 'number',
            description: 'The current value for a slider',
            table: {
                type: { summary: 'number' },
                category: 'other',
                defaultValue: { summary: '10' }, // Convert number to string
            },
        },
    },
};

export default meta;

type PrePostLabel = StoryObj<{ prelabel: string; postlabel: string }>;
export const PrePostLabel: PrePostLabel = {
    render: (args) => MLabelPrePost(args.prelabel, args.postlabel),
};