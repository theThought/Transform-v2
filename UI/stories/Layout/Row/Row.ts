export const RowHtml = (args): string => `
<div class="l-row" style="--column1-width: ${args.SideBySide}%;">
    <div class="l-column">
        1st column:
        <ul>
            <li>Constrained or defined width (e.g. 30%) when used in a <b>sidebyside</b> layout.</li>
            <li>For example, <b>question text</b>.</li>
        </ul>
    </div>
    <div class="l-column">
        2nd column:
        <ul>
            <li>Flexible content, whose width is not defined.</li>
            <li>For example, <b>question controls</b>.</li>
            <li>This is a WIP...</li>
        </ul>
    </div>
</div>
`;

export const RowSingleColumnHtml = (): string => `
<div class="l-row">
    <div class="l-column">
        Single column:
        <ul>
            <li>For example, <b>instruction text</b>.</li>
        </ul>
    </div>
</div>
`;
