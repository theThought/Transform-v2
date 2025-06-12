import { Meta, StoryObj } from '@storybook/web-components';
import { MOptionBase_Story } from './base';
import { MOptionTab } from './tab';

export default {
    title: 'Molecules/Option',
    component: 'm-option-base', // Use the tag name of the custom element
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
        optionStatus: {
            control: 'select',
            options: ['unselected', 'selected', 'readonly'],
            description: 'Display state of the option',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'unselected' },
            },
        },
        exclusive: {
            control: 'boolean',
            description: 'Does selecting this option deselect all others?',
            table: {
                type: { summary: 'boolean' },
                category: 'Dimensions',
                order: 1,
                defaultValue: { summary: 'false' },
            },
        },
        icon: {
            control: 'text',
            description: 'icon for the option',
            table: {
                type: { summary: 'text' },
                category: 'Dimensions',
                order: 5,
                defaultValue: { summary: 'false' },
            },
        },
        optionLabel: {
            control: 'text',
            description: 'Label for the option',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 4,
                defaultValue: { summary: 'This is the option label' },
            },
        },
        categoryId: {
            control: 'text',
            description: 'Unique identifier for the category',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 3,
                defaultValue: { summary: '_C0' },
            },
        },
        questionId: {
            control: 'text',
            description: 'Unique identifier for the question',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 2,
                defaultValue: { summary: '_Q0' },
            },
        },
        questionName: {
            control: 'text',
            description: 'Name of the question',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                order: 6,
                defaultValue: { summary: 'Example' },
            },
        },
    },
} as Meta;

type SingleAnswer = StoryObj<typeof MOptionBase_Story>;
export const StandardRadio: SingleAnswer = {
    parameters: {
        controls: {
            include: ['optionLabel', 'exclusive'],
        },
    },
    args: {
        optionType: 'single-answer',
        exclusive: false,
        questionId: '_Q0',
        categoryId: '_C0',
        questionName: 'RadioExample',
        optionLabel: 'This is standard single-choice option',
        iconType: 'radio',
    },
    render: (args) => MOptionBase_Story(args),
};
StandardRadio.storyName = 'Exclusive option (single-choice)';

type MultiAnswer = StoryObj<typeof MOptionBase_Story>;
export const StandardCheck: MultiAnswer = {
    parameters: {
        controls: {
            include: ['optionLabel', 'exclusive'],
        },
    },
    args: {
        optionType: 'multi-answer',
        exclusive: false,
        questionId: '_Q0',
        categoryId: '_C1',
        questionName: 'CheckExample',
        optionLabel: 'This is standard multi-choice option',
        iconType: 'checkbox',
    },
    render: (args) => MOptionBase_Story(args),
};
StandardCheck.storyName = 'Non-exclusive option (multi-choice)';

type TabstripOption = StoryObj<typeof MOptionTab>;
export const TabstripOption: TabstripOption = {
    parameters: {
        controls: {
            include: ['optionLabel', 'optionStatus'],
        },
    },
    args: {
        exclusive: true,
        questionId: '_Q0',
        categoryId: '_C1',
        questionName: 'TabExample',
        optionLabel: 'Tab name',
    },
    render: (args) => MOptionTab(args),
};
TabstripOption.storyName = 'm-option-tab';
