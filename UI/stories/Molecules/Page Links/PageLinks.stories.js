import { PageLinksHtml } from './PageLinks';

export default {
    title: 'Molecules/Page Links',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },

};

export const PageLinks = {
    render: () => PageLinksHtml(),
};
