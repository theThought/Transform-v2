import React from 'react';

export type PlaceholderType =
    | 'figma'
    | 'image'
    | 'c4'
    | 'component'
    | 'table'
    | 'other';

export type PlaceholderStatus =
    | 'todo'
    | 'in-progress'
    | 'done'
    | 'blocked';

export type PlaceholderProps = {
    id: string;
    type: PlaceholderType;
    purpose: string;
    notes?: string[];
    source?: string;
    owner?: string;
    status?: PlaceholderStatus;
};

const statusColors: Record<PlaceholderStatus, string> = {
    todo: '#B45309',
    'in-progress': '#1D4ED8',
    done: '#166534',
    blocked: '#991B1B',
};

export function Placeholder({
    id,
    type,
    purpose,
    notes = [],
    source = 'tbd',
    owner = 'unassigned',
    status = 'todo',
}: PlaceholderProps): JSX.Element {
    const accent = statusColors[status];

    return (
        <aside
            style={{
                border: `2px dashed ${accent}`,
                borderRadius: 8,
                padding: '12px 14px',
                margin: '16px 0',
                background: '#FCFCFD',
            }}
            aria-label={`placeholder-${id}`}
        >
            <p style={{ margin: 0, fontWeight: 700 }}>Placeholder: {id}</p>
            <p style={{ margin: '6px 0 0 0' }}>
                <strong>Type:</strong> {type}
            </p>
            <p style={{ margin: '2px 0 0 0' }}>
                <strong>Purpose:</strong> {purpose}
            </p>
            <p style={{ margin: '2px 0 0 0' }}>
                <strong>Owner:</strong> {owner}
            </p>
            <p style={{ margin: '2px 0 0 0' }}>
                <strong>Status:</strong> {status}
            </p>
            <p style={{ margin: '2px 0 0 0' }}>
                <strong>Source:</strong> {source}
            </p>
            {notes.length > 0 ? (
                <ul style={{ margin: '8px 0 0 20px' }}>
                    {notes.map((note, index) => (
                        <li key={`${id}-note-${index}`}>{note}</li>
                    ))}
                </ul>
            ) : null}
        </aside>
    );
}
