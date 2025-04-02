import { SublistHtml } from './Sublist';

export default {
    title: 'Organisms/Sublist',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
};

export const Sublist = {
    render: () => SublistHtml(),
};
Sublist.storyName = 'o-option-sublist';
