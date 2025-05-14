import { Meta } from '@storybook/web-components';
import { OSliderWithExclusive } from '../../Organisms/Slider/Slider';

export default {
    title: 'Templates/Slider',
    component: 't-slider', // Use the tag name of the custom element
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
        ticklabels: {
            control: 'number',
            description: 'Display tick labels',
            table: {
                type: { summary: 'number' },
                category: 'display',
                defaultValue: { summary: '' },
            },
        },
        prelabel: {
            control: 'text',
            description: 'Specifies the text to be placed before the input.',
            table: {
                type: { summary: 'text' },
                category: 'Properties',
                subCategory: 'Labels',
                defaultValue: { summary: 'n/a' },
                order: 1,
            },
        },
        postlabel: {
            control: 'text',
            description: 'Specifies the text to be placed after the input.',
            table: {
                type: { summary: 'text' },
                category: 'Properties',
                subCategory: 'Labels',
                defaultValue: { summary: 'n/a' },
                order: 2,
            },
        },
    },
} as Meta;

export const Slider = {
    args: {
        minimum: 0,
        maximum: 100,
        step: 10,
        width: '100%',
        show: {
            marks: true,
        },
        optionType: 'multi-answer',
        exclusive: true,
        questionId: '_Q0',
        categoryId: '_C1',
        questionName: 'CheckExample',
        optionLabel: 'No answer',
        iconType: 'check',
    },
    render: (args: object): HTMLElement => OSliderWithExclusive(args),
};
