import { RowSingleColumnHtml } from './Row';

export default {
    title: 'Layout/Row',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
};

export const RowSingleColumn = {
    render: () => RowSingleColumnHtml(),
};
RowSingleColumn.storyName = 'Row with single column';
