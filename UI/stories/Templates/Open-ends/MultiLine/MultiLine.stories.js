import { MultiLineHtml } from './MultiLine';

export default {
    title: 'Templates/Open-ends/t-multiline',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
};

export const MultiLine = {
    render: () => MultiLineHtml(),
};
