import { Meta, StoryObj } from '@storybook/web-components-vite';
import { MListOption_Story } from './option';

export default {
    title: 'Molecules/List',
    component: 'm-list-option', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        dataValue: {
            control: 'number',
            description:
                'Specifies the name recorded in the data collection platform.',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
            },
        },
        id: {
            control: 'text',
            description: 'Specifies the unique id of the option.',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
            },
        },
        content: {
            control: 'text',
            description: 'Specifies the option text shown to the respondent.',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        state: {
            control: 'boolean',
            description: 'Change the selected state of the option.',
            table: {
                type: { summary: 'boolean' },
                category: 'Content',
            },
        },
    },
} as Meta;

type BaseOption = StoryObj<typeof MListOption_Story>;
export const BaseOption: BaseOption = {
    parameters: {
        controls: {
            exclude: ['iconType'],
        },
    },
    args: {
        dataValue: '1',
        id: '_Q1_C0',
        content: 'this is an option',
        iconType: 'listitem',
    },
    render: (args) => MListOption_Story(args),
};
BaseOption.storyName = 'm-list-option';
