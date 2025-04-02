import { OResponseHtml } from './Response';

export default {
    title: 'Organisms/Response',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
};

export const OResponse = {
    render: () => OResponseHtml(),
};
OResponse.storyName = 'o-response';
