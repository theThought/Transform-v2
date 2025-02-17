import { RowHtml } from './Row';

export default {
    title: 'Layout/Row',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } }
    },
    argTypes: {
        SideBySide: {
            control: 'select',
            options: ['20', '30', '40', '50'],
            description: 'Page property - width of question text, as a percentage of  available width.',
            table: {
                type: { summary: 'select' },
                defaultValue: { summary: '30' }
            },
        },
    },
};

export const Row = {
    args: {
        SideBySide: '30'
    },
    render: (args) => RowHtml(args),
};
