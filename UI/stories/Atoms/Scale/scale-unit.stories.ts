import { StoryObj } from '@storybook/blocks';
import AScaleUnit from '../../../src/javascript/web-components/a-scale-unit';

export default {
    title: 'Atoms/Scale',
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

type Story = StoryObj<typeof AScaleUnit>;
export const Default: Story = {
    args: {
        dataValue: '0',
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const scaleUnit = document.createElement('a-scale-unit');
        scaleUnit.dataValue = args.dataValue;
        return scaleUnit;
    },
};
Default.storyName = 'a-scale-unit';
