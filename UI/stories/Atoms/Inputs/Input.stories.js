import { ASinglelineHtml, AMultilineHtml } from './Input';

export default {
    title: 'Atoms/Inputs',
    parameters: {
        status: { type: 'beta' },
    },
};

export const ASingleline = {
    render: () => ASinglelineHtml(),
};
ASingleline.storyName = 'a-singleline';

export const AMultiline = {
    render: () => AMultilineHtml(),
};
AMultiline.storyName = 'a-multiline';
