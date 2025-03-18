import { QuestionHtml } from './Question';

export default {
    title: 'Layout/Question',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const Question = {
    render: () => QuestionHtml(),
};
