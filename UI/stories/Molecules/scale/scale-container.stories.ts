import { Meta, StoryObj } from '@storybook/web-components';
import { MScaleContainer_Story } from './scale-container';
/**
if (!customElements.get('a-scale-unit')) {
    customElements.define('a-scale-unit', AScaleUnit);
}
*/

export default {
    title: 'Molecules/Scale',
    component: 'm-scale-container', // Use the tag name of the custom element
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
                subcategory: 'input',
                defaultValue: { summary: '1' },
            },
        },
        maximum: { 
            control: 'number',
            description: 'Largest value allowed',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions', // Ensure this matches "minimum"
                subcategory: 'input',  // Ensure this matches "minimum"
                defaultValue: { summary: '100' },
            },
        },
        width: {
            control: 'text',
            description: 'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
    },
} as Meta;

type TenContainer = StoryObj<typeof MScaleContainer_Story>;
export const TenPointContainer: TenContainer = {
    args: {
        minimum: 1,
        maximum: 10,
        width: "15em",
    },
    render: (args) => MScaleContainer_Story(args),
};
TenPointContainer.storyName = 'Ten point scale';

type SevenContainer = StoryObj<typeof MScaleContainer_Story>;
export const SevenPointContainer: SevenContainer = {
    args: {
        minimum: 1,
        maximum: 7,
        width: "10em",
    },
    render: (args) => MScaleContainer_Story(args),
};
SevenPointContainer.storyName = 'Seven point scale';
