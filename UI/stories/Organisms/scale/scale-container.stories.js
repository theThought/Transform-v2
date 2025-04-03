import { ScaleContainerHtml } from './scale-container';

export default {
    title: 'Organisms/scale',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {},
};

export const OScaleContainer = {
    args: {},
    render: (args) => ScaleContainerHtml(args),
};
OScaleContainer.storyName = 'o-scale-container';
