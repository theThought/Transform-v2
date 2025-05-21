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
    },
} as Meta;

export const Tabstrip = {
    parameters: {
        controls: {
            include: ['optionLabel', 'numberOfTabs'],
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
