import type { Meta, StoryObj } from '@storybook/web-components-vite';
import {
    PaletteBlockHtml,
    PaletteHistoryEntryHtml,
} from '../../_shared/Palette';

const meta = {
    title: 'Organisms/Palette',
    parameters: {
        status: { type: 'beta' },
        controls: { sort: 'alpha' },
        docs: { controls: { sort: 'alpha' } },
    },
} satisfies Meta;

export default meta;

type PaletteStory = StoryObj<typeof meta>;

export const OPalette: PaletteStory = {
    name: 'o-palette',
    render: (): string => PaletteBlockHtml(),
};

export const OPaletteLoop: PaletteStory = {
    name: 'o-palette-loop',
    render: (): string => {
        const html = PaletteBlockHtml();
        const parsed = new DOMParser().parseFromString(html, 'text/html');
        return parsed.querySelector('o-palette-loop')?.outerHTML ?? html;
    },
};

export const OPaletteHistoryEntry: PaletteStory = {
    name: 'o-palette-history-entry',
    render: (): string => PaletteHistoryEntryHtml(),
};

export const OHistory: PaletteStory = {
    name: 'o-history (palette dependency)',
    render: (): string => PaletteBlockHtml(),
};

export const OHistoryDescending: PaletteStory = {
    name: 'o-history (descending order)',
    render: (): string => PaletteBlockHtml({ order: 'descending' }),
};
