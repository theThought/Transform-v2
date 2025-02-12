import { ExampleNoArgsHtml } from './Example';

export default {
    title: 'Introduction/Example',
    parameters: {
        status: { type: 'stable' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const ExampleNoArgs = {
    render: () => ExampleNoArgsHtml(),
};
