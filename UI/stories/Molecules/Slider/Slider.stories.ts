import { Meta, StoryObj } from '@storybook/web-components';
import { MSliderMarks, MLabelMarks } from './Slider';

export default {
    title: 'Molecules/Slider',
    component: 'm-slider-marks', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        minimum: {
            control: 'number',
            description: 'Smallest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'input',
                defaultValue: { summary: '0' },
                order: 1, // Ensure minimum appears before maximum
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'input',
                defaultValue: { summary: '100' },
                order: 2, // Ensure maximum appears after minimum
            },
        },
        step: {
            control: 'number',
            description:
                'Stepping interval for incrementing/decrementing the value',
            table: {
                type: { summary: 'number' },
                category: 'input',
                defaultValue: { summary: '10' },
            },
        },
    },
} as Meta;

type SliderMarks = StoryObj<typeof MSliderMarks>;
export const SliderMarks: SliderMarks = {
    args: {
        minimum: 0,
        maximum: 100,
        step: 10,
    },
    render: (args: object): HTMLElement => MSliderMarks(args),
};
SliderMarks.storyName = 'm-slider-marks';

type LabelMarks = StoryObj<typeof MLabelMarks>;
export const LabelMarks: LabelMarks = {
    argTypes: {
        width: {
            control: 'text',
            description:
                'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'text' },
                category: 'dimensions',
            },
        },
    },
    args: {
        minimum: 0,
        maximum: 100,
        step: 10,
        width: '100%',
    },
    render: (args: object): HTMLElement => MLabelMarks(args),
};
LabelMarks.storyName = 'm-label-marks';
