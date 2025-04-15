import { Meta, StoryObj } from '@storybook/blocks';
import TSingleline from './singleline';
import OResponse from '../../src/javascript/web-components/o-response';
import MSingleLine from '../../src/javascript/web-components/m-singleline';
import MSinglelineDate from '../../src/javascript/web-components/m-singleline-date';
import MSinglelineNumber from '../../src/javascript/web-components/m-singleline-number';
import OOptionSublist from '../../src/javascript/web-components/o-option-sublist';

export default {
    title: 'Templates/singleline',
    component: TSingleline,
    tags: ['autodocs'],
    parameters: {
        status: { type: 'beta' },
        controls: {             
        sort: (theFirst, theSecond) => {
            const categoryOrder = ['general', 'parameters', 'properties']; // Desired order
            const categoryFirst = theFirst.table?.category || '';
            const categorySecond = theSecond.table?.category || '';

            // Sort by category order first
            const categoryIndexFirst = categoryOrder.indexOf(categoryFirst);
            const categoryIndexSecond = categoryOrder.indexOf(categorySecond);

            if (categoryIndexFirst !== categoryIndexSecond) {
                return categoryIndexFirst - categoryIndexSecond;
            }

            // If categories are the same, sort alphabetically by name
            return theFirst.name.localeCompare(theSecond.name);
            }, 
        },
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
        oneSizeState: true,
        rtype: 'text',
        prelabel: '',
        postlabel: '',
        minimum: 0,
        maximum: 39,
        width: '15em',
        align: 'Left',
    },
    render: (args) => {
        // Create an instance of TSingleline
        const tSingleline = new TSingleline();
        const oResponse : HTMLElement = document.createElement('o-response');
        const mSingleLine : HTMLElement = document.createElement('m-singleline');
        const aInput: HTMLInputElement = document.createElement('input');
        const aPreLabel: HTMLSpanElement = document.createElement('span');
        const aPostLabel: HTMLSpanElement = document.createElement('span');

        oResponse.appendChild(mSingleLine);
        mSingleLine.appendChild(aInput);
        mSingleLine.appendChild(aPreLabel);
        mSingleLine.appendChild(aInput);
        mSingleLine.appendChild(aPostLabel);
        // Set properties based on args
        tSingleline.responseHTML = oResponse;
        tSingleline.inputHTML = aInput;
        tSingleline.prelabelHTML = aPreLabel;
        tSingleline.postlabelHTML = aPostLabel;

        tSingleline.balanceState = args.balanceState;
        tSingleline.oneSizeState = args.oneSizeState;
        tSingleline.type = args.rtype;
        tSingleline.preLabel = args.prelabel;
        tSingleline.postLabel = args.postlabel;
        tSingleline.minimum = args.minimum;
        tSingleline.maximum = args.maximum;
        tSingleline.width = args.width;
        tSingleline.align = args.align;

        tSingleline.setupStory();
        // Render and return the <o-response> element
        return oResponse;
    },
};

