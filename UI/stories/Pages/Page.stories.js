import { PageHtml } from './Page';

export default {
    title: 'Pages/Page Structure',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const Page = {
    render: () => PageHtml(),
};
