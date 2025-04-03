import {
    ScaleHtml,
    ScaleVerticalHtml,
} from './scale';

export default {
    title: 'Organisms/scale',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
    argTypes: {
        PreLabel: {
            control: 'text',
            description: 'Specifies the text to be placed before the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
        PostLabel: {
            control: 'text',
            description: 'Specifies the text to be placed after the input.',
            table: {
                type: { summary: 'text' },
                defaultValue: { summary: 'n/a' },
            },
        },
    },
};

export const OScale = {
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => ScaleHtml(args),
};
OScale.storyName = 'o-scale';

export const OScaleVertical = {
    argTypes: {
        
    },
    args: {
        PreLabel: '',
        PostLabel: '',
    },
    render: (args) => ScaleVerticalHTML(args),
};
OScaleVertical.storyName = 'o-scale-vertical';
