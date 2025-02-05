import { SingleLineSpecialCodesHtml } from './SingleLine';

export default {
    title: 'Templates/Open-ends/t-singleline (no story controls)',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const SingleLineSpecialCodes = {
    render: () => SingleLineSpecialCodesHtml(),
};
