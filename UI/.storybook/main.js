/* Github Flavoured Markdown */
import remarkGfm from 'remark-gfm';

/** @type { import('@storybook/html-webpack5').StorybookConfig } */
const config = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|ts|tsx)'
    ],
    staticDirs: ['../public'],
    addons: [
        '@storybook/addon-a11y',
        {
            name: '@storybook/addon-docs',
            options: {
            mdxPluginOptions: {
                mdxCompileOptions: {
                remarkPlugins: [remarkGfm],
                },
            },
            },
        },
        {
            name: '@storybook/addon-essentials',
            options: {
                actions: false,
                backgrounds: false,
            }
        },
        '@etchteam/storybook-addon-status',
    ],
    framework: {
        name: '@storybook/html-vite',
        options: {},
    },
    docs: {
        autodocs: true,
    },
};
export default config;
