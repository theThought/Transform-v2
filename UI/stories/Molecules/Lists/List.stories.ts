import { Meta } from '@storybook/web-components';
import { ListOptions } from './List';

export default {
    title: 'Molecules/Lists',
    component: 'm-list', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        itemLabel: {
            control: 'text',
            description: 'Label for the item',
            table: {
                type: { summary: 'string' },
                category: 'Content',
            },
        },
        numberOfItems: {
            control: 'number',
            description: 'Number of items to create',
            table: {
                type: { summary: 'number' },
                category: 'Content',
                defaultValue: { summary: '8' },
            },
        },
    },
} as Meta;

export const OptionList = {
    parameters: {
        controls: {
            include: ['itemLabel', 'numberOfItems'],
        },
    },
    args: {
        questionId: '_Q0',
        categoryId: '_C',
        questionName: 'ListExample',
        itemLabel: 'This is list item number',
        numberOfItems: 8,
    },
    render: (args: object): HTMLElement => ListOptions(args),
};
