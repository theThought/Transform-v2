import { Meta, StoryObj } from '@storybook/blocks';
import AScaleUnit from '../../../src/javascript/web-components/a-scale-unit';

const meta: Meta = {
    title: 'Molecules/scale-unit',
    component: AScaleUnit,
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        dataValue: {
            control: 'text',
            description: 'Specifies the value of the scale unit.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: '0' },
            },
        },
    },
};

export default meta;

type Story = StoryObj<typeof AScaleUnit>;
export const Default: Story = {
    args: {
        dataValue: '0',
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleUnit: AScaleUnit = document.createElement('a-scale-unit');
        scaleUnit.dataValue = args.dataValue;
        return scaleUnit;
    },
};
