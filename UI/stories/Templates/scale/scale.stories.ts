import { Meta, StoryObj } from '@storybook/web-components';

import * as TScale from './scale';

export default {
    title: 'Templates/scale',
    component: 'transform-component',
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        minimum: {
            control: 'number',
            description: 'Smallest value in the scale',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                defaultValue: { summary: '1' },
            },
        },
        maximum: {
            control: 'number',
            description: 'Largest value in the scale',
            table: {
                type: { summary: 'number' },
                category: 'Dimensions',
                defaultValue: { summary: '10' },
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
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Orientation of the scale',
            table: {
                type: { summary: 'string' },
                category: 'Dimensions',
            },
        },
        'properties.labels.pre': {
            control: 'text',
            name: 'pre',
            description: 'A string placed to the left of the scale',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
                subcategory: 'Labels',
                defaultValue: { summary: 'before' },
            },
        },
        'properties.labels.post': {
            control: 'text',
            name: 'post',
            description: 'A string placed to the right of the scale',
            table: {
                type: { summary: 'string' },
                category: 'Custom Properties',
                subcategory: 'Labels',
                defaultValue: { summary: 'after' },
            },
        },
    },
} as Meta;

type TenPointScale = StoryObj<typeof TScale.TScale_Story>;
export const TenPointScale: TenPointScale = {
    parameters: {
        controls: {
            include: ['width', 'minimum', 'maximum', 'pre', 'post'],
        }, // Fixed syntax error
    },
    loaders: [
        async () => {
            try {
                const xmlResponse = await fetch(
                    './build/static/Dimensions/scale.xml',
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
        type: 'number',
        minimum: 1,
        maximum: 10,
        orientation: 'horizontal',
        properties: {
            labels: {
                pre: 'Before',
                post: 'After',
            },
        },
        width: '35em',
    },
    render: (args, { loaded }) => TScale.TScale_Story(args, loaded),
};
TenPointScale.storyName = 'A 10-point scale';
