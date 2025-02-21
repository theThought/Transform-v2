import {
    AInputSinglelineHtml,
    InputMultilineHtml
} from './Input';

export default {
    title: 'Atoms/Inputs',
    parameters: {
        status: { type: 'beta' },
    },
};

export const AInputSingleline = {
    render: () => AInputSinglelineHtml(),
};
AInputSingleline.storyName = 'a-input-singleline';

export const InputMultiline = {
    render: () => InputMultilineHtml(),
};
InputMultiline.storyName = 'a-input-multiline';
