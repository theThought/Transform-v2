import { Meta } from '@storybook/web-components';
import { ComboboxHtml } from './Combobox';

export default {
    title: 'Organisms/Combobox',
    component: 'o-combobox',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
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
        'properties.listsize': {
            control: { type: 'number', min: 0 },
            name: 'listsize',
            description:
                'Configures how many options should be displayed in the list.',
            table: {
                type: { summary: 'number', min: 0 },
                category: 'Custom properties',
                defaultValue: { summary: '6' },
            },
        },
        'properties.listsource': {
            control: 'text',
            name: 'listsource',
            description: 'Identifier for an existing list to re-use data.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        placeholder: {
            control: 'text',
            description:
                'Defines the text to be displayed if no option is selected.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        'properties.exact': {
            control: 'boolean',
            name: 'exact',
            description:
                "Automatically selects an option if it exactly matches the respondent's input.",
            table: {
                category: 'Custom properties',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        'properties.filtertype': {
            control: 'select',
            name: 'filtertype',
            options: ['contains', 'starts'],
            description: 'Determines how options are filtered.',
            table: {
                category: 'Custom properties',
                type: { summary: 'select' },
                defaultValue: { summary: 'contains' },
            },
        },
        'properties.mincharactersforlist': {
            control: { type: 'number', min: 0 },
            name: 'mincharactersforlist',
            description:
                'Defines how many characters must be typed before the list is displayed.',
            table: {
                category: 'Custom properties',
                type: { summary: 'number', min: 0 },
                defaultValue: { summary: '0' },
            },
        },
        'properties.notenoughcharacters': {
            control: 'text',
            name: 'notenoughcharacters',
            description:
                'Defines a message to be displayed before "mincharactersforlist" is met.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        'properties.noitemsinlist': {
            control: 'text',
            name: 'noitemsinlist',
            description:
                'Defines a message to be displayed if there are no matching options.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
    },
} as Meta;

export const Combobox = {
    parameters: {
        controls: {
            exclude: ['properties', 'questionId', 'questionName'],
        },
    },
    args: {
        numberOfItems: 8,
        questionId: '_Q0',
        questionName: 'QuestionName',
        placeholder: 'Placeholder',
        properties: {},
    },
    render: (args: object): HTMLElement => ComboboxHtml(args),
};
