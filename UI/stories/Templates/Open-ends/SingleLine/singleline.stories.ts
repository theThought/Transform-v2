import { Meta, StoryObj } from '@storybook/blocks';
import TSingleline from './singleline';

export default {
    title: '../Templates/singleline',
    component: TSingleline,
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        align: {
            control: 'string',
            options: ['Left', 'Right', 'Center'],
            description: 'alignment of the content within the input',
            default: 'Left',
            table: {
                type: { summary: 'string',
                    category: 'parameters'
                 },
            },
        },
        minimum: {
            control: 'number',
            description: 'the smallest value in the scale.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' },
                category: 'parameters',
            },
        },
        maximum: {
            control: 'number',
            description: 'the largest value in the scale.',
            table: {
                type: { summary: 'number' },
                category: 'parameters'
            },
        },
        prelabel: {
            control: 'string',
            description: 'a string placed before the input',
            table: {
                type: { summary: 'string' },
                category: 'properties'
            },
        },
        postlabel: {
            control: 'string',
            description: 'a string placed after the input',
            table: {
                type: { summary: 'string' },
                category: 'properties'
            },
        },
    }
};

type Playground = StoryObj<typeof TSingleline>;
export const TenPoint: Playground = {
    name: 'Singleline (text)',
    args: {
        minimum: 1,
        maximum: 10,
        prelabel: 'PreLabel',
        postlabel: 'PostLabel',
        align: 'Left',
        type: 'text',
        width: '15em'
    },
    render: (args) => {
        // Create a new instance of the MScaleUnit class
        const singleline = new TSingleline();
        singleline.minimum = args.minimum;
        singleline.maximum = args.maximum;
        singleline.preLabel = args.prelabel;
        singleline.postLabel = args.postlabel;
        singleline.align = args.align;
        singleline.type = args.type;
        singleline.width = args.width;
        singleline.step = args.step;
        singleline.balanceMinWidth = args.balanceMinWidth;
        singleline.oneSizeMaxWidth = args.oneSizeMaxWidth;

        return scaleContainer;
    },
};

