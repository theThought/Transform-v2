import { Meta, StoryObj } from '@storybook/web-components';

import * as TChoice from './choice';

export default {
    title: 'Templates/choice',
    component: 'transform-component',
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        optionType: {
            control: 'select',
            options: ['single-answer', 'multi-answer'],
            description: 'Sinlge or multi-answer question',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'single-answer' },
            },
        },
        balanceState: {
            control: 'boolean',
            description: 'Options are balanced to optimize horizontal space',
            table: {
                type: { summary: 'boolean' },
                category: 'Properties',
                subcategory: 'balance',
                order: 1,
                defaultValue: { summary: 'false' },
            },
        },
        balanceMinWidth: {
            control: 'text', // Changed from 'string' to 'text' for consistency
            description: 'Minimum width for a balanced item',
            table: {
                type: { summary: 'string' },
                category: 'Properties', // Corrected typo
                subcategory: 'balance',
                order: 2,
            },
        },
        onesizeState: {
            control: 'boolean',
            description: 'Options are balanced to optimize horizontal space',
            table: {
                type: { summary: 'boolean' },
                category: 'Properties',
                subcategory: 'onesize',
                order: 1,
                defaultValue: { summary: 'false' },
            },
        },
        onesizeMaxWidth: {
            control: 'text', // Changed from 'string' to 'text' for consistency
            description: 'Maximum width for a one-size item',
            table: {
                type: { summary: 'string' },
                category: 'Properties',
                subcategory: 'onesize',
                order: 2,
            },
        },
    },
} as Meta;

type Simplelist = StoryObj<typeof TChoice.TChoice_Story>;
export const ASimpleList: Simplelist = {
    loaders: [
        async (args) => {
            console.log('args in loader:', args);
            try {
                const xmlFileName =
                    args.optionType === 'multi-answer'
                        ? 'choice - simple - multi.xml'
                        : 'choice - simple - single.xml';

                const xmlResponse = await fetch(
                    `./build/static/Dimensions/${xmlFileName}`,
                );
                const xslResponse = await fetch(
                    './build/static/Dimensions/question.xsl',
                );

                if (!xmlResponse.ok || !xslResponse.ok) {
                    throw new Error('Failed to fetch XML or XSLT files.');
                }
                console.log('xml data:', xmlFileName);
                const xmlData = await xmlResponse.text();
                const xslData = await xslResponse.text();

                return { xmlData, xslData };
            } catch (error) {
                console.error('Error in text loader:', error);
                throw error;
            }
        },
    ],
    render: (args, { loaded }) => TChoice.TChoice_Story(args, loaded),
};
ASimpleList.storyName = 'A simple list with a heading';
