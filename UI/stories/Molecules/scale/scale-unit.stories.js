import {
    ScaleUnitHtml
} from './scale';

export default {
    title: 'Molecules/Scale',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {},
};

export const MScaleUnit = {
    args: {
        
    },
    render: (args) => ScaleUnitHtml(args),
};
MScaleUnit.storyName = 'm-scale-unit';