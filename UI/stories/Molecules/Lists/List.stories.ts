import { Meta } from '@storybook/web-components';
import { MList_Story } from './List';

export default {
    title: 'Molecules/List',
    component: 'm-list', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
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
    args: {
        numberOfItems: 8,
    },
    render: (args: object): HTMLElement => MList_Story(args),
};
