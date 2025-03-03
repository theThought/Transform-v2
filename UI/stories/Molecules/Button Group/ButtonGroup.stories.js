import { ButtonGroupHtml } from './ButtonGroup';

export default {
    title: 'Molecules/Button Group',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },

};

export const ButtonGroup = {
    render: () => ButtonGroupHtml(),
};
