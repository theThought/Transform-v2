import { Preview } from '@storybook/web-components';

const preview: Preview = {
    parameters: {
        options: {
            storySort: {
                order: ['Introduction', 'Layout', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'],
            },
        },
    },

    tags: ['autodocs']
};

export default preview;
