import { Meta, StoryObj } from '@storybook/web-components-vite';
import { AButtonIcon_Story } from './button-icon';

export default {
    title: 'Atoms/Button',
    component: 'a-button-icon',
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        className: {
            control: 'text',
            description: 'CSS class name for styling the button icon',
        },
        label: {
            control: 'text',
            description: 'Text content of the button icon',
        },
    },
} as Meta;

type ButtonIcon = StoryObj<typeof AButtonIcon_Story>;

export const ButtonIcon: ButtonIcon = {
    args: {
        label: '+',
    },
    render: (args) => AButtonIcon_Story(args),
};
ButtonIcon.storyName = 'a-button-icon';
