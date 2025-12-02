import { Preview } from '@storybook/web-components-vite';

const preview: Preview = {
    parameters: {
        deepControls: { enabled: true },
        options: {
            storySort: {
                order: [
                    'Introduction',
                    'Layout',
                    'Atoms',
                    'Molecules',
                    'Organisms',
                    'Templates',
                    'Pages',
                ],
            },
        },
        docs: {
            source: {
                transform: (code: string) => {
                    const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
                    const translate = {
                        nbsp: ' ',
                        amp: '&',
                        quot: '"',
                        lt: '<',
                        gt: '>',
                    };
                    return code
                        .replace(translate_re, function (match, entity) {
                            return translate[entity];
                        })
                        .replace(/&#(\d+);/gi, function (match, numStr) {
                            const num = parseInt(numStr, 10);
                            return String.fromCharCode(num);
                        })
                        .replace(/>/g, '>\n    ')
                        .replace(/([a-zA-Z])</g, '$1\n<')
                        .replace(/>\n(\s)*<\//g, '></');
                },
            },
        },
    },

    tags: ['autodocs'],
};

export default preview;
