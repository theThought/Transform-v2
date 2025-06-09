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
        'properties.labels.position': {
            control: 'select',
            options: ['outside', 'before', 'after'],
            name: 'position',
            description: 'Specifies the location of the labels',
            table: {
                type: { summary: 'outside | before | after' },
                category: 'Custom Properties',
                subcategory: 'Labels',
                defaultValue: { summary: 'outside' },
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
                defaultValue: { summary: 'false' },
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
            exclude: ['properties'],
        },
    },
    args: {
        width: '100%',
        properties: {},
    },
    render: (args: object): HTMLElement => OSlider(args),
};
