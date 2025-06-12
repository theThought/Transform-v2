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
    },
} as Meta;

export const OptionList = {
    parameters: {
        controls: {
            exclude: ['questionId', 'questionName', 'iconType'],
        },
    },
    args: {
        numberOfItems: 8,
        questionId: '_Q0',
        questionName: 'QuestionName',
        iconType: 'checkbox',
    },
    render: (args: object): HTMLElement => OList_Story(args),
};
