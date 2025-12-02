import { Meta, StoryObj } from '@storybook/web-components-vite';
import { OOptionSublist_Story } from './sublist';

export default {
    title: 'Organisms/Option/sublist',
    component: 'o-option-sublist', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        optionType: {
            control: 'select',
            options: ['single-answer', 'multi-answer'],
            description: 'Single or multi-answer question',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'single-answer' },
            },
        },
        isSublist: {
            control: 'boolean',
            description: 'Indicates if the component is a sublist',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                subcategory: 'sublist',
                defaultValue: { summary: 'false' },
            },
        },
        'properties.balance.state': {
            control: 'boolean',
            name: 'balance.state',
            description: 'Options are balanced to optimize horizontal space',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                subcategory: 'Balance',
                defaultValue: { summary: 'false' },
            },
        },
        'properties.balance.minwidth': {
            control: 'text',
            name: 'minwidth',
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
                subcategory: 'Balance',
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
        exclusive: {
            control: 'boolean',
            description: 'Does selecting this option deselect all others?',
            table: {
                type: { summary: 'boolean' },
                category: 'Dimensions',
                defaultValue: { summary: 'true' },
            },
        },
        optionLabel: {
            control: 'text',
            description: 'Label for the option',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: 'This is the option label' },
            },
        },
        categoryId: {
            control: 'text',
            description: 'Unique identifier for the category',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: '_C0' },
            },
        },
        questionId: {
            control: 'text',
            description: 'Unique identifier for the question',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: '_Q0' },
            },
        },
        questionName: {
            control: 'text',
            description: 'Name of the question',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                defaultValue: { summary: 'Example' },
            },
        },
        heading: {
            control: 'text',
            description: 'Heading for the list',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        IncludeNone: {
            control: 'boolean',
            description: 'Include a "None of the above" option',
            table: {
                type: { summary: 'boolean' },
                category: 'Dimensions',
                defaultValue: { summary: 'false' },
            },
        },
        optionCount: {
            control: 'number',
            description: 'Number of options in the list',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                defaultValue: { summary: '5' },
            },
        },
    },
} as Meta;

type Simplelist = StoryObj<typeof OOptionSublist_Story>;
export const ListNoHeading: Simplelist = {
    parameters: {
        controls: {
            include: [
                'optionType',
                'optionLabel',
                'IncludeNone',
                'optionCount',
                'balance.state',
                'minwidth',
                'onesize.state',
                'maxwidth',
            ],
        },
    },
    args: {
        optionType: 'single-answer',
        questionId: '_Q0',
        questionName: 'SimpleList',
        optionLabel: 'Simple list option',
        exclusive: false,
        IncludeNone: false,
        balanceState: false,
        balanceMinWidth: '100px',
        onesizeState: false,
        onesizeMaxWidth: '100px',
        categoryId: '_C0',
        heading: '',
        optionCount: 5,
        properties: {},
    },
    render: (args) => {
        return OOptionSublist_Story(args);
    },
};
ListNoHeading.storyName = 'A simple list no heading';

type Sublist = StoryObj<typeof OOptionSublist_Story>;
export const ListWithHeading: Sublist = {
    parameters: {
        controls: {
            include: [
                'optionLabel',
                'IncludeNone',
                'exclusive',
                'optionCount',
                'heading',
                'balance.state',
                'minwidth',
                'onesize.state',
                'maxwidth',
            ],
        },
    },
    args: {
        questionId: '_Q0',
        questionName: 'SimpleList',
        optionLabel: 'Simple list option ',
        optionCount: 5,
        properties: {},
    },
    render: (args) => OOptionSublist_Story(args),
};
ListWithHeading.storyName = 'A simple list with a heading';
