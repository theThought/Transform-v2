import { StackHtml } from './Stack';

export default {
    title: 'Layout/Stack',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const Stack = {
    render: () => StackHtml(),
};
