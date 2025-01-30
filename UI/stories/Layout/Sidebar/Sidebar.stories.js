import { SidebarHtml } from './Sidebar';

export default {
    title: 'Layout/Sidebar',
    parameters: {
        status: { type: 'beta' },
    },
};

export const Sidebar = {
    render: () => SidebarHtml(),
};
