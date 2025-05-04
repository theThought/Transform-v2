import { Meta, StoryObj } from '@storybook/web-components';
import { OOptionSublist_Story } from './sublist';

export default {
    title: 'Organisms/Option/Sublist',
    component: 'o-option-sublist', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        isSublist: {
            control: 'boolean',
            description: 'Indicates if the component is a sublist',
            table: {
                type: { summary: 'boolean' },
                category: 'Properties',
                subcategory: 'sublist',
                order: 1,
            },
        },
        balanceState: {
            control: 'boolean',
            description: 'Options are balanced to optimize horizontal space',
            table: {
                type: { summary: 'boolean' },
                category: 'Properties',
                subcategory: 'balance',
                order: 1,
            },
        },
        balanceMinWidth: {
            control: 'text', // Changed from 'string' to 'text' for consistency
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                category: 'Properties', // Corrected typo
                subcategory: 'balance',
                order: 2,
            },
        },
        onesizeState: {
            control: 'boolean',
            description: 'Options are balanced to optimize horizontal space',
            table: {
                type: { summary: 'boolean' },
                category: 'Properties',
                subcategory: 'onesize',
                order: 1,
            },
        },
        onesizeMaxWidth: {
            control: 'text', // Changed from 'string' to 'text' for consistency
            description: 'Maximum width for a one-size item',
            table: {
                type: { summary: 'string' },
                category: 'Properties',
                subcategory: 'onesize',
                order: 2,
            },
        },
        exclusive: {
            control: 'boolean',
            description: 'Does selecting this option deselect all others?',
            table: {
                type: { summary: 'boolean' },
                category: 'Dimensions',
                order: 2,
            },
        },
        iconType: {
            control: 'text',
            description: 'Icon for the option',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 3,
            },
        },
        optionLabel: {
            control: 'text',
            description: 'Label for the option',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 4,
            },
            defaultValue: 'This is the option label',
        },
        categoryId: {
            control: 'text',
            description: 'Unique identifier for the category',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 5,
            },
            defaultValue: '_C0',
        },
        questionId: {
            control: 'text',
            description: 'Unique identifier for the question',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 6,
            },
            defaultValue: '_Q0',
        },
        questionName: {
            control: 'text',
            description: 'Name of the question',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 7,
            },
            defaultValue: 'Example',
        },
        heading: {
            control: 'text',
            description: 'Heading for the list',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 8,
            },
            defaultValue: 'This is a sublist heading',
        },
        IncludeNone: {
            control: 'boolean',
            description: 'Include a "None of the above" option',
            table: {
                type: { summary: 'boolean' },
                category: 'Dimensions',
                order: 9,
            },
        },
        optionCount: {
            control: 'number',
            description: 'Number of options in the list',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                order: 10,
            },
            defaultValue: 5,
        },
    },
} as Meta;

type Simplelist = StoryObj<typeof OOptionSublist_Story>;
export const ListNoHeading: Simplelist = {
    parameters: {
        controls: {
            include: [
                'optionLabel',
                'IncludeNone',
                'exclusive',
                'optionCount',
                'balanceState',
                'balanceMinWidth',
                'onesizeState',
                'onesizeMaxWidth',
            ],
        }, // Fixed syntax error
    },
    args: {
        questionId: '_Q0',
        questionName: 'SimpleList',
        optionLabel: 'Simple list option ',
        heading: '',
        isSublist: false,
    },
    render: (args) => OOptionSublist_Story(args),
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
                'balanceState',
                'balanceMinWidth',
                'onesizeState',
                'onesizeMaxWidth',
            ],
        }, // Fixed syntax error
    },
    args: {
        questionId: '_Q0',
        questionName: 'SimpleList',
        optionLabel: 'Simple list option ',
    },
    render: (args) => OOptionSublist_Story(args),
};
ListWithHeading.storyName = 'A simple list with a heading';
