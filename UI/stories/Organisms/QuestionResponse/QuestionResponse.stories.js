import { OQuestionResponseHtml } from './QuestionResponse';

export default {
    title: 'Organisms/Question Response',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const OQuestionResponse = {
    render: () => OQuestionResponseHtml(),
};
OQuestionResponse.storyName = '<o-question-response>';
