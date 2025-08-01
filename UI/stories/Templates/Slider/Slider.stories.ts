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
                category: 'Dimensions',
                defaultValue: { summary: '0' },
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                defaultValue: { summary: '100' },
            },
        },
        'properties.step': {
            control: 'number',
            name: 'step',
            description:
                'Stepping interval for incrementing/decrementing the value',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
                defaultValue: { summary: '1' },
            },
        },
        width: {
            control: 'text',
            description:
                'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'text' },
                category: 'Dimensions',
            },
        },
        'properties.ticklabels': {
            control: 'number',
            name: 'ticklabels',
            description: 'Interval of tick labels',
            table: {
                type: { summary: 'number' },
                category: 'Custom Properties',
                subcategory: 'Show',
            },
        },
        'properties.labels.pre': {
            control: 'text',
            name: 'pre',
            description: 'Specifies the text to be placed before the input',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
                subcategory: 'Labels',
            },
        },
        'properties.labels.post': {
            control: 'text',
            name: 'post',
            description: 'Specifies the text to be placed after the input',
            table: {
                type: { summary: 'text' },
                category: 'Custom Properties',
                subcategory: 'Labels',
            },
        },
        'properties.show.marks': {
            control: 'boolean',
            name: 'marks',
            description: 'Display tick marks',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                subcategory: 'Show',
                defaultValue: { summary: 'false' },
            },
        },
        'properties.show.terminators': {
            control: 'boolean',
            name: 'terminators',
            description: 'Display terminator buttons',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                subcategory: 'Show',
            },
        },
        'properties.show.value': {
            control: 'boolean',
            name: 'value',
            description: 'Display thumb value',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
                subcategory: 'Show',
                defaultValue: { summary: 'true' },
            },
        },
    },
} as Meta;

export const Slider = {
    parameters: {
        controls: {
            include: [
                'width',
                'minimum',
                'maximum',
                'step',
                'ticklabels',
                'pre',
                'post',
                'marks',
                'terminators',
                'value',
            ],
        },
    },
    args: {
        width: '100%',
        properties: {},
        optionType: 'multi-answer',
        exclusive: true,
        questionId: '_Q0',
        categoryId: '_C1',
        questionName: 'CheckExample',
        optionLabel: 'No answer',
        iconType: 'checkbox',
    },
    render: (args: object): HTMLElement => OSliderWithExclusive(args),
};
