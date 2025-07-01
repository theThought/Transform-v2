import { Meta } from '@storybook/web-components';
import { DropdownHtml } from './Dropdown';

export default {
    title: 'Organisms/Dropdown',
    component: 'o-dropdown',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        'properties.jumptofirstletter': {
            control: 'boolean',
            name: 'jumptofirstletter',
            description:
                'Navigate to first matching entry when respondent types a character.',
            table: {
                category: 'Custom properties',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        'properties.listsize': {
            control: { type: 'number', min: 1 },
            name: 'listsize',
            description:
                'Configures how many options should be displayed in the list.',
            table: {
                category: 'Custom properties',
                type: { summary: 'number', min: 1 },
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
            name: 'placeholder',
            description:
                'Defines the text to be displayed if no option is selected.',
            table: {
                category: 'Dimensions',
                type: { summary: 'text' },
                defaultValue: { summary: '' },
            },
        },
    },
} as Meta;

export const Dropdown = {
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
        iconType: 'listitem',
        properties: {
            listsize: 6,
        },
    },
    render: (args: object): HTMLElement => DropdownHtml(args),
};
