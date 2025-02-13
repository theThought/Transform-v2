import {
    LabelQuestionUsingLabelHtml,
    LabelQuestionUsingDivHtml,
    LabelOptionHtml,
    LabelHeadingSublistHtml,
    LabelPrePostHtml,
} from './Label';

export default {
    title: 'Atoms/Labels',
    parameters: {
        status: { type: 'beta' },
    }
};

export const LabelQuestionUsingLabel = {
    render: () => LabelQuestionUsingLabelHtml(),
};
LabelQuestionUsingLabel.storyName = 'a-label-question using <label>';

export const LabelQuestionUsingDiv = {
    render: () => LabelQuestionUsingDivHtml(),
};
LabelQuestionUsingDiv.storyName = 'a-label-question using <div>';

export const LabelOption = {
    render: () => LabelOptionHtml(),
};
LabelOption.storyName = 'a-label-option';

export const LabelHeadingSublist = {
    render: () => LabelHeadingSublistHtml(),
};
LabelHeadingSublist.storyName = 'a-label-heading-sublist';

export const LabelPrePost = {
    render: () => LabelPrePostHtml(),
};
LabelPrePost.storyName = 'a-label-prepost';
