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
                    // Dynamically resolve file paths relative to this story file
                    const storyUrl = new URL(import.meta.url);
                    const xmlUrl = new URL('./XML/singleline_v2.xml', storyUrl).href;
                    const xsltUrl = new URL('./question.xsl', storyUrl).href;
console.log('XML URL:', xmlUrl);
                    // Fetch the files
                    const xmlResponse = await fetch(xmlUrl);
                    const xsltResponse = await fetch(xsltUrl);

                    // Check if the files were fetched successfully
                    if (!xmlResponse.ok) {
                        console.error('XML file not found. Ensure singleline_v2.xml is accessible next to the story.');
                        throw new Error(`Failed to fetch XML file: ${xmlResponse.statusText}`);
                    }
                    if (!xsltResponse.ok) {
                        console.error('XSLT file not found. Ensure question.xsl is accessible next to the story.');
                        throw new Error(`Failed to fetch XSLT file: ${xsltResponse.statusText}`);
                    }

                    const xmlData = await xmlResponse.text();
                    const xsltData = await xsltResponse.text();

                    // Log the loaded data for debugging
                    console.log('Loaded XML Data:', xmlData);
                    console.log('Loaded XSLT Data:', xsltData);

                    return { storyUrl, xmlUrl, xsltUrl, xmlData, xsltData };
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
            description: 'Input type required',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'text' },
                category: 'general',
            },
        },
        align: {
            control: 'select',
            options: ['Left', 'Right', 'Center'],
            description: 'Alignment of the content within the input',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'Left' },
                category: 'parameters',
            },
        },
        width: {
            control: 'text',
            description: 'Input width using a value and a measurement (e.g., px, em, %)',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '15em' },
                category: 'parameters',
            },
        },
        minimum: {
            control: 'number',
            description: 'The smallest value allowed',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '1' },
                category: 'parameters',
            },
        },
        maximum: {
            control: 'number',
            description: 'The largest value allowed',
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: '39' },
                category: 'parameters',
            },
        },
        prelabel: {
            control: 'text',
            description: 'A string placed BEFORE the input',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'properties',
                subcategory: 'labels',
            },
        },
        postlabel: {
            control: 'text',
            description: 'A string placed AFTER the input',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: '' },
                category: 'properties',
                subcategory: 'labels',
            },
        },
        balanceState: {
            control: 'boolean',
            description: 'Whether balance should be applied',
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
            description: 'Whether OneSize should be applied',
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
    render: (_, { loaded: { storyURL, xmlURL, xsltURL, xmlData, xsltData } }) => {

        console.log('Resolved Story URL:', storyURL);
        console.log('Resolved XML URL:', xmlURL);
        console.log('Resolved XSLT URL:', xsltURL);

        const transformComponent = new TransformComponent(xmlData, xsltData);
        return transformComponent.transform();
    },
};