import { SingleLineSpecialCodesHtml } from './SingleLine';

export default {
    title: 'Templates/Open-ends/t-singleline (special codes)',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
};

export const SingleLineSpecialCodes = {
    render: () => SingleLineSpecialCodesHtml(),
};
