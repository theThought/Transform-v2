import { Meta, StoryObj } from '@storybook/blocks';
import TransformComponent from '../../components/TransformComponent';

export default {
    title: 'Templates/singlelineV2',
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
        loaders: [
            async () => {
                try {
                    const xmlResponse = await fetch('./singleline_v2.xml');
                    const xsltResponse = await fetch('./question.xsl');
        
                    // Log the status of the fetch calls
                    console.log('XML Response Status:', xmlResponse.status);
                    console.log('XSLT Response Status:', xsltResponse.status);
        
                    if (!xmlResponse.ok) {
                        throw new Error(`Failed to fetch data XML file: ${xmlResponse.statusText}`);
                    }
                    if (!xsltResponse.ok) {
                        throw new Error(`Failed to fetch question XSLT file: ${xsltResponse.statusText}`);
                    }
        
                    const xmlData = await xmlResponse.text();
                    const xsltData = await xsltResponse.text();
        
                    return { xmlData, xsltData };
                } catch (error) {
                    console.error('Error in loader:', error);
                    throw error;
                }
            },
        ],
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
} as Meta;


type Story = StoryObj;

export const Default: Story = {
    render: (_, { loaded: { xmlData, xsltData } }) => {
        const transformComponent = new TransformComponent(xmlData, xsltData);
        return transformComponent.transform();
    },
};