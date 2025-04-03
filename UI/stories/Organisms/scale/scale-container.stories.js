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

export const MScaleContainer = {
    args: {},
    render: (args) => ScaleContainerHtml(args),
};
MScaleUnit.storyName = 'm-scale-container';
