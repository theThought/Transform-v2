import { Meta, StoryObj } from '@storybook/web-components';
import { AScaleUnit_Story } from './scale-unit';

if (!customElements.get('a-scale-unit')) {
    customElements.define('a-scale-unit', AScaleUnit);
}

export default {
    title: 'Atoms/Scale',
    component: 'a-scale-unit', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        dataValue: {
            control: 'text',
            description: 'Specifies the value of the scale unit.',
            table: {
                type: { summary: 'text' },
                category: 'Dimensions',
                defaultValue: { summary: '10' },
            },
        },
    },
} as Meta;

type TenPoint = StoryObj<typeof AScaleUnit_Story>;
export const TenPoint: TenPoint = {
    args: {
        dataValue: '10',
    },
    render: (args) => AScaleUnit_Story(args),
    /**
        const container: AScaleUnit = document.createElement('a-scale-unit');
        container.setAttribute('data-value', args.dataValue);
        container.textContent = args.dataValue;
        return container;
    },
     */
};
TenPoint.storyName = 'a-scale-unit';
