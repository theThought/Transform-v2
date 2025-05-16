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
                category: 'Custom Properties',
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
                category: 'Custom Properties', // Corrected typo
                subcategory: 'balance',
                order: 2,
            },
        },
        onesizeState: {
            control: 'boolean',
            description: 'Options are balanced to optimize horizontal space',
            table: {
                type: { summary: 'boolean' },
                category: 'Custom Properties',
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
                category: 'Custom Properties',
                subcategory: 'onesize',
                order: 2,
            },
        },
    },
} as Meta;

export const TSimplelist: StoryObj<typeof TChoice.TChoice_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

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
        optionType: 'single-answer',
    },
    render: (args, { loaded }) => TChoice.TChoice_Story(args, loaded),
};
TSimplelist.storyName = 'A simple list with a heading';

export const TSimplePlusExclusive: StoryObj<typeof TChoice.TChoice_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {
                const xmlResponse = await fetch(
                    './build/static/Dimensions/choice - simple with exclusive.xml',
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
        optionType: 'multi-answer',
    },
    render: (args, { loaded }) => TChoice.TChoice_Story(args, loaded),
};
TSimplePlusExclusive.storyName = 'A simple multi-answer with one exclusive';

export const TSimpleSublist: StoryObj<typeof TChoice.TChoice_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {
                const xmlFileName =
                    args.optionType === 'multi-answer'
                        ? 'choice - simple sublist - multi.xml'
                        : 'choice - simple sublist - single.xml';

                const xmlResponse = await fetch(
                    `./build/static/Dimensions/${xmlFileName}`,
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
        optionType: 'single-answer',
    },
    render: (args, { loaded }) => TChoice.TChoice_Story(args, loaded),
};
TSimpleSublist.storyName = 'A simple multi-answer with one exclusive';

export const TSublistPlusExclusive: StoryObj<typeof TChoice.TChoice_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {
                const xmlResponse = await fetch(
                    './build/static/Dimensions/choice - sublist with exclusive.xml',
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
        optionType: 'multi-answer',
    },
    render: (args, { loaded }) => TChoice.TChoice_Story(args, loaded),
};
TSublistPlusExclusive.storyName =
    'A multi-answer sublist with one exclusive outside the list';

export const TComplexlist: StoryObj<typeof TChoice.TChoice_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {
                const xmlFileName =
                    args.optionType === 'multi-answer'
                        ? 'choice - complex - multi.xml'
                        : 'choice - complex - single.xml';

                const xmlResponse = await fetch(
                    `./build/static/Dimensions/${xmlFileName}`,
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
        optionType: 'single-answer',
    },
    render: (args, { loaded }) => TChoice.TChoice_Story(args, loaded),
};
TComplexlist.storyName =
    'A complex list of items in sublists and outside of them';
