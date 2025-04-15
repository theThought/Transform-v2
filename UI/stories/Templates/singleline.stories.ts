import { Meta, StoryObj } from '@storybook/blocks';
import TSingleline from './singleline';

export default {
    title: 'Templates/singleline',
    component: TSingleline,
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        rtype: {
            name: 'Sub-variant',
            control: 'select',
            options: ['text', 'number', 'date'],
            description: 'input type required',
            table: {
                    type: { summary: 'string' },
                    defaultValue: { summary: 'text' },
                    category: 'general'
                 },
            },        
        align: {
            control: 'select',
            options: ['Left', 'Right', 'Center'],
            description: 'alignment of the content within the input',

            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Left' },
                category: 'parameters',
                },
            },
        width: {
                control: 'text',
                description: 'input width using a value and a measurement (eg px, em, %)',
                table: {
                    type: { summary: 'string' },
                    defaultValue: { summary: '15em' },
                    category: 'parameters',
                     },
            },
        minimum: {
            control: 'number',
            description: 'the smallest value allowed.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' },
                category: 'parameters',
            },
        },
        maximum: {
            control: 'number',
            description: 'the largest value allowed.',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '39' },
                category: 'parameters',
            },
        },
        prelabel: {
            control: 'text',
            description: 'a string placed BEFORE the input',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'properties',
                subcategory: 'labels',
            },
        },
        postlabel: {
            control: 'text',
            description: 'a string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'properties',
                subcategory: 'labels',
            },
        },
        balanceState: {
            control: 'boolean',
            description: 'whether balance should be applied',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
                category: 'properties',
                subcategory: 'balance',
            },
        },
        balanceMinWidth: {
            control: 'text',
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'properties',
                subcategory: 'balance',
            },
        },
        oneSizeState: {
            control: 'boolean',
            description: 'whether OneSize should be applied',
            table: {
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
                category: 'properties',
                subcategory: 'onesize',
            },
        },
        oneSizeMaxWidth: {
            control: 'text',
            description: 'Maximum width for a sized item',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'properties',
                subcategory: 'onesize',
            },
        },
    },
} as Meta<typeof TSingleline>;


type Playground = StoryObj<typeof TSingleline>;
export const TenPoint: Playground = {
    name: 'Singleline (text)',
    args: {
        balanceState: true,
        oneSizeState: true
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

        singleline.render()
        return singleline;
    },
};

