import { OptionListHtml } from './List';

export default {
    title: 'Molecules/Lists',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    }
};

export const OptionList = {
    render: () => OptionListHtml(),
};
OptionList.storyName = 'm-list';
