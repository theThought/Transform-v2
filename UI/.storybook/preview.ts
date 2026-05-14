import { Preview } from '@storybook/web-components-vite';

const preview: Preview = {
    parameters: {
        deepControls: { enabled: true },
        options: {
            storySort: (a, b) => {
                // Custom order for the "Responses" folder
                const responsesOrder = [
                    'Responses/General Information',
                    'Responses/Choice',
                ];
                // If both stories are in "Responses", use custom order
                if (
                    a[1].title.startsWith('Responses/') &&
                    b[1].title.startsWith('Responses/')
                ) {
                    const aIdx = responsesOrder.indexOf(a[1].title);
                    const bIdx = responsesOrder.indexOf(b[1].title);
                    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
                    if (aIdx !== -1) return -1;
                    if (bIdx !== -1) return 1;
                }
                // Default: alphabetical
                return a[1].title.localeCompare(b[1].title, undefined, { numeric: true });
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
