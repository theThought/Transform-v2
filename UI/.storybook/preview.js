/** @type { import('@storybook/html').Preview } */
const preview = {
    parameters: {
        options: {
            storySort: {
                order: ['Introduction', 'Layout', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'],
            },
        },
    },
};

export default preview;
