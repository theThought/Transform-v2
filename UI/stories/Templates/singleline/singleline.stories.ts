import { Meta, StoryObj } from '@storybook/web-components-vite';
import TransformComponent from '../../../components/TransformComponent';
import OResponse from '../../../src/javascript/web-components/o-response';
import MSingleLine from '../../../src/javascript/web-components/m-singleline';
import MSinglelineNumber from '../../../src/javascript/web-components/m-singleline-number';
import MSinglelineDate from '../../../src/javascript/web-components/m-singleline-date';

// Define the custom element tag name
if (!customElements.get('o-response')) {
    customElements.define('o-response', OResponse);
}
if (!customElements.get('m-singleline')) {
    customElements.define('m-singleline', MSingleLine);
}
if (!customElements.get('m-singleline-number')) {
    customElements.define('m-singleline-number', MSinglelineNumber);
}
if (!customElements.get('m-singleline-date')) {
    customElements.define('m-singleline-date', MSinglelineDate);
}
customElements.define('transform-component', TransformComponent);

console.log('Custom element transform-component defined');
// Define loaders for each story
const numberLoader = async () => {
    try {
    const xmlResponse = await fetch('./build/static/Dimensions/singleline-number.xml');
    const xslResponse = await fetch('./build/static/Dimensions/question.xsl');

    if (!xmlResponse.ok || !xslResponse.ok) {
        throw new Error('Failed to fetch XML or XSLT files.');
    }

    const xmlData = await xmlResponse.text();
    const xslData = await xslResponse.text();

    return { xmlData, xslData };
    }
    catch (error) {
        console.error('Error in number loader:', error);
        throw error;
    }
};

const dateLoader = async () => {
    const xmlResponse = await fetch('./build/static/Dimensions/singleline-date.xml');
    const xslResponse = await fetch('./build/static/Dimensions/question.xsl');
    try {
    if (!xmlResponse.ok || !xslResponse.ok) {
        throw new Error('Failed to fetch XML or XSLT files.');
    }

    const xmlData = await xmlResponse.text();
    const xslData = await xslResponse.text();

    return { xmlData, xslData };
    }
    catch (error) {
            console.error('Error in date loader:', error);
            throw error;
        }
};

const textLoader = async () => {
    const xmlResponse = await fetch('./build/static/Dimensions/singleline.xml');
    const xslResponse = await fetch('./build/static/Dimensions/question.xsl');
    try {
    if (!xmlResponse.ok || !xslResponse.ok) {
        throw new Error('Failed to fetch XML or XSLT files.');
    }

    const xmlData = await xmlResponse.text();
    const xslData = await xslResponse.text();

    return { xmlData, xslData };
    }
    catch (error) {
            console.error('Error in text loader:', error);
            throw error;
        }
};

export default {
    title: 'Templates/singleline',
    component: 'transform-component', // Use the tag name of the custom element
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

export const text: Story = {
    loaders: [textLoader],
    render: (_, { loaded }) => {

        const { xmlData, xslData } = loaded || {};

        // Create an instance of TransformComponent
        const transformComponent = new TransformComponent(xmlData, xslData);

        // Perform the transformation and return the resulting DOM element
        const transformedElement = transformComponent.transform();

        // Return the DOM element to Storybook
        return transformedElement;
    },
};

export const number: Story = {
    loaders: [numberLoader],
    render: (_, { loaded }) => {

        const { xmlData, xslData } = loaded || {};

        // Create an instance of TransformComponent
        const transformComponent = new TransformComponent(xmlData, xslData);

        // Perform the transformation and return the resulting DOM element
        const transformedElement = transformComponent.transform();

        // Return the DOM element to Storybook
        return transformedElement;
    },
};

export const date: Story = {
    loaders: [dateLoader],
    render: (_, { loaded }) => {

        const { xmlData, xslData } = loaded || {};

        // Create an instance of TransformComponent
        const transformComponent = new TransformComponent(xmlData, xslData);

        // Perform the transformation and return the resulting DOM element
        const transformedElement = transformComponent.transform();

        // Return the DOM element to Storybook
        return transformedElement;
    },
};