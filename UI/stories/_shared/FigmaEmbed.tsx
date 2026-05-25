import React from 'react';

type FigmaEmbedProps = {
    fileKey: string;
    nodeId: string;
    height?: number;
};

export function FigmaEmbed({
    fileKey,
    nodeId,
    height = 450,
}: FigmaEmbedProps): JSX.Element {
    // nodeId must be dash-separated (e.g. "12-345") — Figma's share links use colons, but the embed URL requires dashes.
    const params = new URLSearchParams({
        'embed-host': 'storybook',
        'node-id': nodeId,
        'page-selector': 'false',
    });
    const src = `https://embed.figma.com/design/${fileKey}?${params}`;

    return (
        <iframe
            title="Figma design embed"
            width="100%"
            height={height}
            style={{
                border: 'none',
                borderRadius: '4px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0 1px 3px 0',
                outline: '1px solid #e2e8f0',
            }}
            src={src}
            // allowFullScreen
        />
    );
}
