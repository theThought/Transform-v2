import {
    AInputSinglelineEditHtml,
    InputMultilineHtml
} from './Input';

export default {
    title: 'Atoms/Inputs',
    parameters: {
        status: { type: 'beta' },
    },
};

export const AInputSinglelineEdit = {
    render: () => AInputSinglelineEditHtml(),
};
AInputSinglelineEdit.storyName = 'a-input-singlelineedit';

export const InputMultiline = {
    render: () => InputMultilineHtml(),
};
InputMultiline.storyName = 'a-input-multiline';
