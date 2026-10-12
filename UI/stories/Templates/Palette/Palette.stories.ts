import type { Meta } from '@storybook/web-components-vite';
import { PalettePageHtml } from '../../_shared/Palette';

const meta = {
    title: 'Templates/Palette',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
} satisfies Meta;

export default meta;

export const Palette = {
    render: (): string => PalettePageHtml(),
};
