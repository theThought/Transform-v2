import {
    LabelQuestionUsingLabelHtml,
    LabelQuestionUsingDivHtml,
    LabelOptionHtml,
} from './Label';

export default {
    title: 'Atoms/Labels',
    parameters: {
        status: {
            type: 'beta',
        },
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
