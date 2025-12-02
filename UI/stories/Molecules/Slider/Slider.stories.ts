import { Meta } from '@storybook/web-components-vite';
import { OSliderTrack } from './Slider';

export default {
    title: 'Molecules/Slider Track',
    component: 'm-slider-track', // Use the tag name of the custom element
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
        properties: {},
    },
    render: (args: object): HTMLElement => OSliderTrack(args),
};
