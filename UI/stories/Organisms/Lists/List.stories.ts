import { Meta } from '@storybook/web-components';
import { OList_Story } from './List';

export default {
    title: 'Organisms/List',
    component: 'o-list', // Use the tag name of the custom element
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
        'properties.listsize': {
            control: 'number',
            name: 'listsize',
            description: 'Specifies the number of visible options in the list.',
            table: {
                type: { summary: 'number' },
                category: 'Custom properties',
                defaultValue: { summary: '6' },
            },
        },
    },
} as Meta;

export const OptionList = {
    parameters: {
        controls: {
            exclude: ['questionId', 'questionName', 'iconType', 'properties'],
        },
    },
    args: {
        numberOfItems: 8,
        questionId: '_Q0',
        questionName: 'QuestionName',
        iconType: 'listitem',
        properties: {
            listsize: 6,
        },
    },
    render: (args: object): HTMLElement => OList_Story(args),
};
