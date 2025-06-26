import { Meta, StoryObj } from '@storybook/web-components';

import * as TCombo from './combo';

export default {
    title: 'Templates/combobox',
    component: 'transform-component',
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        'properties.listsize': {
            control: { type: 'number', min: 0 },
            name: 'listsize',
            description:
                'Configures how many options should be displayed in the list.',
            table: {
                type: { summary: 'number', min: 0 },
                category: 'Custom properties',
                defaultValue: { summary: '6' },
            },
        },
        'properties.listsource': {
            control: 'text',
            name: 'listsource',
            description: 'Identifier for an existing list to re-use data.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        placeholder: {
            control: 'text',
            description:
                'Defines the text to be displayed if no option is selected.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        'properties.exact': {
            control: 'boolean',
            name: 'exact',
            description:
                "Automatically selects an option if it exactly matches the respondent's input.",
            table: {
                category: 'Custom properties',
                type: { summary: 'boolean' },
                defaultValue: { summary: 'true' },
            },
        },
        'properties.filtertype': {
            control: 'select',
            name: 'filtertype',
            options: ['contains', 'starts'],
            description: 'Determines how options are filtered.',
            table: {
                category: 'Custom properties',
                type: { summary: 'select' },
                defaultValue: { summary: 'contains' },
            },
        },
        'properties.mincharactersforlist': {
            control: { type: 'number', min: 0 },
            name: 'mincharactersforlist',
            description:
                'Defines how many characters must be typed before the list is displayed.',
            table: {
                category: 'Custom properties',
                type: { summary: 'number', min: 0 },
                defaultValue: { summary: '0' },
            },
        },
        'properties.notenoughcharacters': {
            control: 'text',
            name: 'notenoughcharacters',
            description:
                'Defines a message to be displayed before "mincharactersforlist" is met.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        'properties.noitemsinlist': {
            control: 'text',
            name: 'noitemsinlist',
            description:
                'Defines a message to be displayed if there are no matching options.',
            table: {
                category: 'Custom properties',
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
    },
} as Meta;

export const TCombobox_Short: StoryObj<typeof TCombo.TCombo_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {

                const xmlResponse = await fetch(
                    `./build/static/Dimensions/combo - simple.xml`,
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
        properties: {
            listsize: 10,
        },
    },
    render: (args, { loaded }) => TCombo.TCombo_Story(args, loaded),
};
TCombobox_Short.storyName = 'Combobox - few items';

export const TCombobox_Long: StoryObj<typeof TCombo.TCombo_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {

                const xmlResponse = await fetch(
                    `./build/static/Dimensions/combo - drugs.xml`,
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
        properties: {
            listsize: 10,
        },
    },
    render: (args, { loaded }) => TCombo.TCombo_Story(args, loaded),
};
TCombobox_Long.storyName = 'Combobox - few items';
