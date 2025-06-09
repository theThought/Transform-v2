import { Meta } from '@storybook/web-components';
import { OTabstrip } from './Tabstrip';

export default {
    title: 'Organisms/Tabstrip',
    component: 'o-tabstrip', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        optionLabel: {
            control: 'text',
            description: 'Label for the option',
            table: {
                type: { summary: 'string' },
                category: 'Content',
                defaultValue: { summary: 'This is the option label' },
            },
        },
        numberOfTabs: {
            control: 'number',
            description: 'Number of tabs',
            table: {
                type: { summary: 'number' },
                category: 'Content',
                defaultValue: { summary: '3' },
            },
        },
        'properties.onesize.state': {
            control: 'boolean',
            name: 'onesize.state',
            description:
                'Options are forced to occupy the same space as the widest/tallest item',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                subcategory: 'Onesize',
                defaultValue: { summary: 'false' },
            },
        },
        'properties.onesize.maxwidth': {
            control: 'text',
            name: 'maxwidth',
            description: 'Maximum width for a one-size item',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
                subcategory: 'Onesize',
            },
        },
    },
} as Meta;

export const Tabstrip = {
    parameters: {
        controls: {
            include: [
                'optionLabel',
                'numberOfTabs',
                'onesize.state',
                'maxwidth',
            ],
        },
    },
    args: {
        exclusive: true,
        questionId: '_Q0',
        categoryId: '_C1',
        questionName: 'TabExample',
        optionLabel: 'Tab',
        numberOfTabs: 3,
    },
    render: (args: object): HTMLElement => OTabstrip(args),
};
