import {
    ButtonHtml,
    InputButtonHtml
} from './Button';

export default {
    title: 'oldstuff/Buttons',
    parameters: {
        status: { type: 'stable' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },

};

export const Button = {
    render: () => ButtonHtml(),
};

export const InputButton = {
    render: () => InputButtonHtml(),
};
