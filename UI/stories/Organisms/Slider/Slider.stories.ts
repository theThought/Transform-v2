import { Meta } from '@storybook/web-components';
import { OSlider } from './Slider';

export default {
    title: 'Organisms/Slider',
    component: 'o-slider', // Use the tag name of the custom element
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

export const Slider = {
    args: {
        dataValue: '10',
    },
    render: (args: object): HTMLElement => OSlider(args),
};
