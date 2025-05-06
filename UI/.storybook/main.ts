/* Github Flavoured Markdown */
import remarkGfm from 'remark-gfm';
import { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    staticDirs: [
        '../public',
        '../src/static', // Include the static folder
    ],
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
                docs: false,
            },
        },
        '@etchteam/storybook-addon-status',
    ],
    framework: {
        name: '@storybook/web-components-vite',
        options: {},
    },
    docs: {
        autodocs: true,
    },
};

export default config;
