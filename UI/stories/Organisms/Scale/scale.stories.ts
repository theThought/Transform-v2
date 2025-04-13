import { Meta, StoryObj } from '@storybook/blocks';
import OScale from '../../../src/javascript/web-components/o-scale';

export default {
    title: 'Organisms/scale',
    component: OScale,
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        minimum: {
            control: 'number',
            description: 'the smallest value in the scale.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' },
            },
        },
        maximum: {
            control: 'number',
            description: 'the largest value in the scale.',
            table: {
                type: { summary: 'number' },
            },
        },
    },
};

type ScaleTen = StoryObj<typeof OScale>;
export const TenPoint: ScaleTen = {
    name: '10-point scale',
    args: {
        minimum: 1,
        maximum: 10,
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleContainer = document.createElement('o-scale');
        scaleContainer.setAttribute('data-question-id', '_Q0');
        scaleContainer.setAttribute('data-question-group', '_QText');
        scaleContainer.setAttribute(
            'data-properties',
            '{"labels":{"pre":"preLabel","post":"PostLabel"}}',
        );
        return scaleContainer;
    },
};

type ScaleSeven = StoryObj<typeof OScale>;
export const SevenPoint: ScaleTen = {
    name: '10-point scale',
    args: {
        minimum: 1,
        maximum: 7,
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleContainer = document.createElement('o-scale');
        scaleContainer.setAttribute('data-question-id', '_Q0');
        scaleContainer.setAttribute('data-question-group', '_QText');
        scaleContainer.setAttribute(
            'data-properties',
            '{"labels":{"pre":"preLabel","post":"PostLabel"}}',
        );
        return scaleContainer;
    },
};
