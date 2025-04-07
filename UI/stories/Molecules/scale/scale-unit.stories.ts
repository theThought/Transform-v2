import { Meta, StoryObj } from '@storybook/blocks';
import MScaleUnit from './scale-unit';

 customElements.define('m-scale-unit', MScaleUnit);

 const meta: Meta= {
    title: 'Molecules/scale-unit',
    component: MScaleUnit,
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

type Story = StoryObj<typeof MScaleUnit>;
export const Default: Story = {
    args: {
        dataValue: '0',
    },
    render: (args) => MScaleUnit(args),
};
