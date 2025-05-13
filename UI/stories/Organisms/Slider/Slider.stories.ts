import { Meta } from '@storybook/web-components';
import { OSlider } from './Slider';

export default {
    title: 'Organisms/Slider',
    component: 'o-slider', // Use the tag name of the custom element
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
                defaultValue: { summary: '1' },
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
                type: { summary: 'text' },
                category: 'input',
                defaultValue: { summary: 'any' },
            },
        },
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
} as Meta;

export const Slider = {
    args: {
        minimum: 1,
        maximum: 100,
        step: 10,
        width: '100%',
    },
    render: (args: object): HTMLElement => OSlider(args),
};
