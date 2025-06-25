import { Meta, StoryObj } from '@storybook/web-components';

import * as TList from './list';

export default {
    title: 'Templates/list',
    component: 'transform-component',
    parameters: {
        status: { type: 'beta' },
    },
    argTypes: {
        'properties.listsize': {
            control: { type: 'number', min: 2 },
            name: 'listsize',
            description:
                'Configures how many options should be displayed in the list.',
            table: {
                type: { summary: 'number', min: 2 },
                category: 'Custom properties',
            },
        },
    },
} as Meta;

export const TListbox: StoryObj<typeof TList.TList_Story> = {
    loaders: [
        async (context) => {
            const { args } = context; // Extract args from context

            try {

                const xmlResponse = await fetch(
                    `./build/static/Dimensions/list - organisation.xml`,
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
    render: (args, { loaded }) => TList.TList_Story(args, loaded),
};
TListbox.storyName = 'A list box with a small number of items';
