import { Meta, StoryObj } from '@storybook/web-components';

import * as TSingleline from './singleline';

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
                subcategory: 'input', // Ensure this matches "minimum"
                defaultValue: { summary: '100' },
            },
        },
        minimumDate: {
            control: 'date',
            description: 'Earliest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions',
                subcategory: 'input',
                defaultValue: { summary: '1' },
            },
        },
        maximumDate: {
            control: 'date',
            description: 'latest acceptable date',
            table: {
                type: { summary: 'date' },
                category: 'Dimensions', // Ensure this matches "minimum"
                subcategory: 'input', // Ensure this matches "minimum"
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
            description:
                'Input width using a value and a measurement (e.g., px, em, %)',
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
        step: {
            control: 'number',
            description: 'increment and precision of the number',
            table: {
                type: { summary: 'number' },
                category: 'properties',
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
        prelabel: {
            control: 'text',
            description: 'A string placed to the left of the scale',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels',
                defaultValue: { summary: 'before' },
            },
        },
        postlabel: {
            control: 'text',
            description: 'A string placed to the right of the scale',
            table: {
                type: { summary: 'string' },
                category: 'properties',
                subcategory: 'labels',
                defaultValue: { summary: 'after' },
            },
        },
    },
} as Meta;

type TextStory = StoryObj<typeof TSingleline.TSingleLine_Story>;
export const TextStory = {
    parameters: {
        controls: {
            include: [
                'align',
                'width',
                'minimum',
                'maximum',
                'prelabel',
                'postlabel',
                'step',
            ],
        },
    },
    loaders: [
        async () => {
            try {
                const xmlResponse = await fetch(
                    './build/static/Dimensions/singleline.xml',
                );
                const xslResponse = await fetch(
                    './build/static/Dimensions/question.xsl',
                );

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
        },
    ],
    args: {
        type: 'text',
        minimum: 1,
        maximum: 40,
        align: 'Left',
        width: '15em',
    },
    render: (args, { loaded }) => TSingleline.TSingleLine_Story(args, loaded),
    };

type NumberStory = StoryObj<typeof TSingleline.TSingleLine_Story>;
export const NumberStory = {
    parameters: {
        controls: {
            include: [
                'align',
                'width',
                'minimum',
                'maximum',
                'prelabel',
                'postlabel',
                'step',
            ],
        }, 
    },
    loaders: [
        async () => {
            try {
                const xmlResponse = await fetch(
                    './build/static/Dimensions/singleline-number.xml',
                );
                const xslResponse = await fetch(
                    './build/static/Dimensions/question.xsl',
                );

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
        },
    ],
    args: {
        type: 'number',
        minimum: 1,
        maximum: 100,
        align: 'Right',
        width: '4em',
    },
    render: (args, { loaded }) => TSingleline.TSingleLine_Story(args, loaded),
};


type DateStory = StoryObj<typeof TSingleline.TSingleLine_Story>;
export const DateStory = {
    parameters: {
        controls: {
            include: [
                'align',
                'width',
                'minimumDate',
                'maximumDate',
                'prelabel',
                'postlabel',
                'step',
            ],
    loaders: [
        async () => {
            try {
                const xmlResponse = await fetch(
                    './build/static/Dimensions/singleline-date.xml',
                );
                const xslResponse = await fetch(
                    './build/static/Dimensions/question.xsl',
                );

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
        },
    ],
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
    render: (args, { loaded }) => TSingleline.TSingleLine_Story(args, loaded),
};
