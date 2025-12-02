import { Meta, StoryObj } from '@storybook/web-components-vite';
import { AScaleUnit_Story } from './scale-unit';

export default {
    title: 'Atoms/Scale',
    component: 'a-scale-unit', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        dataValue: {
            control: 'number',
            description: 'Specifies the value of the scale unit.',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                defaultValue: { summary: '10' },
            },
        },
    },
} as Meta;

type TenValue = StoryObj<typeof AScaleUnit_Story>;
export const TenValue: TenValue = {
    args: {
        dataValue: '10',
    },
    render: (args) => AScaleUnit_Story(args),
};
TenValue.storyName = 'a-scale-unit';
