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
        align: {
            name: 'Sub-variant',
            control: 'string',
            options: ['text', 'number', 'date'],
            description: 'input type required',
            default: 'text',
            table: {
                type: { summary: 'string'
                 },
            },
        },        
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
            width: {
                control: 'string',
                description: 'input width using a value and a measurement (eg px, em, %)',
                default: '15em',
                table: {
                    type: { summary: 'string',
                        category: 'parameters'
                     },
                },
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
                category: 'parameters'
            },
        },
        prelabel: {
            control: 'string',
            description: 'a string placed BEFORE the input',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels'
            },
        },
        postlabel: {
            control: 'string',
            description: 'a string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels'
            },
        },
        balanceState: {
            control: 'boolean',
            description: 'whether balance should be applied',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'balance'
            },
        },
        balanceMinWidth: {
            control: 'string',
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'balance'
            },
        balanceState: {
            control: 'boolean',
            description: 'whether balance should be applied',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'balance'
            },
        },
        balanceMinWidth: {
            control: 'string',
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'balance'
            },
        },
        onsSizeState: {
            control: 'boolean',
            description: 'whether OneSize should be applied',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'onesize'
            },
        },
        oneSizeMaxWidth: {
            control: 'string',
            description: 'Maximum width for a sized item',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'onesize'
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


        return singleline;
    },
};

