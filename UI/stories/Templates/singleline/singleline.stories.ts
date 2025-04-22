import { Meta, StoryObj } from '@storybook/web-components';
import TransformComponent from '../../../components/TransformComponent';
import OResponse from '../../../src/javascript/web-components/o-response';
import MSingleLine from '../../../src/javascript/web-components/m-singleline';
import MSinglelineNumber from '../../../src/javascript/web-components/m-singleline-number';
import MSinglelineDate from '../../../src/javascript/web-components/m-singleline-date';
import * as TSingleline from './singleline';

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

export default {
    title: 'Templates/singleline',
    component: 'transform-component', // Use the tag name of the custom element
    parameters: {
        status: { type: 'beta' },
        },
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'number', 'range', 'number', 'date'],
            description: 'Type of input required',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
                subcategory: 'input',
                defaultValue: { summary: 'text' },
            },
        },
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
        align: {
            control: 'select',
            options: ['Left', 'Right', 'Center'],
            description: 'Alignment of the content within the input',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
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
        hidden: {
            control: 'boolean',
            description: 'Is the input hidden?',
            table: {
                type: { summary: 'string' },
                category: 'Internal',
            },
        },
        balanceState: {
            control: 'boolean',
            description: 'Whether balance should be applied',
            table: {
                type: { summary: 'boolean' },
                category: 'properties',
                subcategory: 'balance',
            },
        },
        balanceMinWidth: {
            control: 'text',
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'balance',
            },
        },
        oneSizeState: {
            control: 'boolean',
            description: 'Whether OneSize should be applied',
            table: {
                type: { summary: 'boolean' },
                category: 'properties',
                subcategory: 'onesize',
            },
        },
        oneSizeMaxWidth: {
            control: 'text',
            description: 'Maximum width for a sized item',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'onesize',
            },
        },
    },
} as Meta;

type TextStory = StoryObj<typeof TSingleline.TSingleLine_Story>;
export const textStory = {
    parameters: {
        controls: { include: ['align', 'width', 'minimum', 'maximum'] }, // Fixed syntax error
    },
    loaders: [async () => { 
        try {
            const xmlResponse = await fetch('./build/static/Dimensions/singleline.xml');
            const xslResponse = await fetch('./build/static/Dimensions/question.xsl');

            if (!xmlResponse.ok || !xslResponse.ok) {
                throw new Error('Failed to fetch XML or XSLT files.');
            }

            const xmlData = await xmlResponse.text();
            const xslData = await xslResponse.text();

            return { xmlData, xslData };
        } catch (error) {
            console.error('Error in text loader:', error);
            throw error;
        }
    }],
    args: {
        type: 'text',
        minimum: 1,
        maximum: 40,
        align: 'Left',
        width: '15em',
    },
    render: (args) => TSingleline.TSingleLine_Story(args),
};

type NumberStory = StoryObj<typeof TSingleline.TSingleLine_Story>;
export const NumberStory = {
    parameters: {
        controls: { include: ['type', 'align', 'width', 'minimum', 'maximum'] }, // Fixed syntax error
    },
    loaders: [async () => {
        try {
            const xmlResponse = await fetch('./build/static/Dimensions/singleline-number.xml');
            const xslResponse = await fetch('./build/static/Dimensions/question.xsl');

            if (!xmlResponse.ok || !xslResponse.ok) {
                throw new Error('Failed to fetch XML or XSLT files.');
            }

            const xmlData = await xmlResponse.text();
            const xslData = await xslResponse.text();

            return { xmlData, xslData };
        } catch (error) {
            console.error('Error in number loader:', error);
            throw error;
        }
    }],
    args: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        align: 'Right',
        width: '4em',
    },
    render: (args) => TSingleline.TSingleLine_Story(args),
};

type DateStory = StoryObj<typeof TSingleline.TSingleLine_Story>;
export const DateStory = {
    parameters: {
        controls: { include: ['type', 'align', 'width', 'minimum', 'maximum'] }, // Fixed syntax error
    },
    loaders: [async () => {
        try {
            const xmlResponse = await fetch('./build/static/Dimensions/singleline-date.xml');
            const xslResponse = await fetch('./build/static/Dimensions/question.xsl');

            if (!xmlResponse.ok || !xslResponse.ok) {
                throw new Error('Failed to fetch XML or XSLT files.');
            }

            const xmlData = await xmlResponse.text();
            const xslData = await xslResponse.text();

            return { xmlData, xslData };
        } catch (error) {
            console.error('Error in date loader:', error);
            throw error;
        }
    }],
    args: {
        type: 'date',
        width: '10em',
        align: 'Center',
        minimum: (() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })(),
        maximum: (() => {
            const tenDaysFromNow = new Date();
            tenDaysFromNow.setDate(tenDaysFromNow.getDate() + 10);
            return tenDaysFromNow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        })(),
    },
    render: (args) => TSingleline.TSingleLine_Story(args),
};