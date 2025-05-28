import { Meta, StoryObj } from '@storybook/web-components';
import * as ButtonTerminatorStories from './button-terminator';

export default {
    title: 'Atoms/Button',
    parameters: {
        status: { type: 'beta' },
    },
};

type ButtonTerminator = StoryObj<
    typeof ButtonTerminatorStories.AButtonTerminator
>;

export const ButtonTerminatorPre: ButtonTerminator = {
    render: (args: object): HTMLInputElement =>
        ButtonTerminatorStories.AButtonTerminator(args),
};

export const ButtonTerminatorPost: ButtonTerminator = {
    render: (args: object): HTMLInputElement =>
        ButtonTerminatorStories.AButtonTerminator(args),
};
