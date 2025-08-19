import Component from './component';

interface CaptionProps {
    content?: string;
    align?: 'left' | 'right' | 'center' | 'default' | string;
    width?: string;
}

interface CellShadingProps {
    rowheader?: boolean;
    columheader?: boolean;
    altrows?: boolean;
}

interface TopHeadingsCaptionProp {
    content?: string;
    colspan?: number;
}

type TopHeadingsProps = Array<TopHeadingsCaptionProp>;

interface LabelProps {
    pre?: string;
    post?: string;
}

interface TotalsProps {
    visible?: boolean;
    excludereadonly?: boolean;
    align?: 'left' | 'right' | 'center' | 'default' | string;
    width?: string;
    caption?: CaptionProps;
    labels?: LabelProps;
    exceptions?: number[];
}

interface GridTotalsProps {
    rows?: TotalsProps;
    columns?: TotalsProps;
}

interface GridProperties {
    totals?: GridTotalsProps;
    cellshading?: CellShadingProps;
    topheadings?: TopHeadingsProps;
}

type TotalEntry = {
    id: string;
    value: number;
    column: number;
    row: number;
    readonly: boolean;
};

export default class OLoop extends Component {
    private grid: HTMLTableElement | null = null;
    private hasRowTotals = false;
    private rowTotals: TotalEntry[] = [];
    private excludeRowReadOnly = true;
    private excludeColumnReadOnly = true;
    private columnTotals: TotalEntry[] = [];
    private hasGrandTotal = false;

    public properties: GridProperties = {};

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.loadPropertiesFromAttributes();

        this.grid = this.querySelector('table');
        if (!this.grid) return;

        this.configureCellEvents();
        this.configureRowStyles();
        this.topHeadings();

        this.addEventListener('broadcastChange', this.handleEvent);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'broadcastChange':
                this.receiveBroadcast(e as CustomEvent);
                break;
            default:
                break;
        }
    }

    // Utilities
    private debug(message: string, level = 1): void {
        if (level >= 2) {
            console.warn(`[OQuestionGrid] ${message}`);
        } else {
            console.log(`[OQuestionGrid] ${message}`);
        }
    }

    private replaceHTMLPlaceholder(content?: string): string {
        if (typeof content !== 'string') return '';
        // Placeholder for potential templating; currently returns as-is.
        return content;
    }

    private loadPropertiesFromAttributes(): void {
        const raw =
            this.getAttribute('data-properties') ||
            this.getAttribute('data-props') ||
            this.getAttribute('data-config') ||
            '';

        if (!raw) {
            this.properties = this.properties || {};
            return;
        }

        try {
            this.properties = JSON.parse(raw) as GridProperties;
        } catch {
            this.debug('Failed to parse properties JSON from attributes.', 2);
            this.properties = {};
        }
    }

    // Heading utilities
    public topHeadings(): void {
        if (
            !this.grid ||
            !Array.isArray(this.properties.topheadings) ||
            !this.properties.topheadings.length
        )
            return;

        const headingRow = this.grid.insertRow(0);
        headingRow.className = 'm-structure-caption-row';

        for (let i = 0; i < this.properties.topheadings.length; i++) {
            const newTH = document.createElement('th');
            newTH.scope = 'col';
            newTH.innerHTML = `<span class="a-label-caption">${this.properties.topheadings[i].content ?? ''}</span>`;
            newTH.colSpan = this.properties.topheadings[i].colspan ?? 1;
            newTH.className = 'm-structure-cell m-structure-heading';
            headingRow.appendChild(newTH);
        }
    }

    // Row styling
    private configureRowStyles(): void {
        if (!this.grid) return;

        const tableRowList = this.grid.querySelectorAll(
            'tr.m-structure-row, tr.m-structure-row-error',
        );
        let stripedRowIterator = 0;

        for (let i = 0; i < tableRowList.length; i++) {
            const row = tableRowList[i] as HTMLTableRowElement;
            if (row.classList.contains('m-structure-row-error')) {
                continue;
            }

            stripedRowIterator++;

            if (stripedRowIterator % 2 !== 0) {
                row.classList.add('striped');

                if (
                    typeof tableRowList[i - 1] !== 'undefined' &&
                    tableRowList[i - 1].classList.contains(
                        'm-structure-row-error',
                    )
                ) {
                    tableRowList[i - 1].classList.add('striped');
                }
            }
        }
    }

    // DOM text search utility
    public recursiveTextSearch(node: Node, text = ''): string {
        if (node.nodeType === Node.TEXT_NODE) {
            text += (node.nodeValue || '').trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            node.childNodes.forEach((child) => {
                text = this.recursiveTextSearch(child, text);
            });
        }
        return text;
    }

    // Cell click handling
    private configureCellEvents(): void {
        if (!this.grid) return;

        for (
            let i = 0, row: HTMLTableRowElement | undefined;
            (row = this.grid.rows[i]);
            i++
        ) {
            for (
                let j = 0, col: HTMLTableCellElement | undefined;
                (col = row.cells[j] as HTMLTableCellElement);
                j++
            ) {
                col.addEventListener(
                    'click',
                    function (this: HTMLTableCellElement, event: MouseEvent) {
                        // prevent bubbled events from firing this function
                        const target = event.target as HTMLElement;
                        if (
                            (target as HTMLInputElement)?.type !== undefined ||
                            event.detail === 0
                        ) {
                            return;
                        }

                        let element:
                            | HTMLInputElement
                            | HTMLButtonElement
                            | HTMLTextAreaElement
                            | null = null;

                        const input = <HTMLInputElement>(
                            this.getElementsByTagName('INPUT')[0]
                        );
                        const button = <HTMLButtonElement>(
                            this.getElementsByTagName('BUTTON')[0]
                        );
                        const textarea = <HTMLTextAreaElement>(
                            this.getElementsByTagName('TEXTAREA')[0]
                        );

                        if (input) element = input;
                        else if (button) element = button;
                        else if (textarea) element = textarea;

                        if (!element) {
                            // Unexpected: column without an input/control
                            return;
                        }

                        // preference for focus is text, number, radio/check, then button
                        if (
                            (element as HTMLInputElement).type === 'text' ||
                            (element as HTMLInputElement).type === 'number'
                        ) {
                            element.focus();
                            return;
                        }

                        if (
                            (element as HTMLInputElement).type === 'checkbox' ||
                            (element as HTMLInputElement).type === 'radio'
                        ) {
                            const label = <HTMLLabelElement>(
                                this.getElementsByTagName('LABEL')[0]
                            );
                            if (label) label.click();
                            else element.click();
                            return;
                        }

                        element.focus();
                    },
                );
            }
        }
    }

    // Shading toggles
    public cellshading(props: {
        headerColumn?: boolean;
        altColumns?: boolean;
        headerRow?: boolean;
        altRows?: boolean;
    }): void {
        if (!this.grid) return;

        if (props.headerColumn === true) {
            this.grid.classList.add('shade-headercolumn');
        }

        if (props.altColumns === true) {
            this.grid.classList.add('shade-altcolumns');
        }

        if (props.headerRow === true) {
            this.grid.classList.add('shade-headerrow');
        }

        if (props.altRows === true) {
            this.grid.classList.add('shade-altrows');
        }
    }

    // Totals setup
    public totals(props: { rows?: TotalsProps; columns?: TotalsProps }): void {
        if (!this.grid) return;

        // Save for later calculations
        this.properties.totals = this.properties.totals || {};
        if (props.rows)
            this.properties.totals.rows = {
                ...(this.properties.totals.rows || {}),
                ...props.rows,
            };
        if (props.columns)
            this.properties.totals.columns = {
                ...(this.properties.totals.columns || {}),
                ...props.columns,
            };

        if (props.rows && props.rows.visible) {
            this.excludeRowReadOnly = props.rows.excludereadonly ?? true;
            this.configureRowTotals(props.rows);
            this.rowTotals = [];
            this.getTableInputElements('row');
            this.recalculateRowTotals();
        }

        if (props.columns && props.columns.visible) {
            this.excludeColumnReadOnly = props.columns.excludereadonly ?? true;
            this.configureColumnTotals(props.columns);
            this.columnTotals = [];
            this.getTableInputElements('column');
            this.recalculateColumnTotals();
        }
    }

    private getTableInputElements(direction: 'row' | 'column'): void {
        if (!this.grid) return;

        for (
            let i = 0, row: HTMLTableRowElement | undefined;
            (row = this.grid.rows[i]);
            i++
        ) {
            for (
                let j = 0, col: HTMLTableCellElement | undefined;
                (col = row.cells[j] as HTMLTableCellElement);
                j++
            ) {
                const inputElement = col.querySelector(
                    'input',
                ) as HTMLInputElement | null;
                if (inputElement) {
                    const details: TotalEntry = {
                        id: inputElement.id,
                        value: Number(inputElement.value) || 0,
                        column: j,
                        row: i,
                        readonly: inputElement.readOnly,
                    };
                    (this as any)[`${direction}totals`].push(details);
                }
            }
        }
    }

    private receiveBroadcast(event: CustomEvent): void {
        const detail: any = event.detail || {};
        const element = detail.element as HTMLElement | undefined;
        if (!element || element.tagName !== 'INPUT') {
            return;
        }

        const id = detail.id as string;
        const elementValue = Number((element as HTMLInputElement).value) || 0;

        const rowIndex = this.rowTotals.map((e) => e.id).indexOf(id);
        if (rowIndex !== -1) {
            this.rowTotals[rowIndex].value = elementValue;
            this.recalculateRowTotals();
        }

        const colindex = this.columnTotals.map((e) => e.id).indexOf(id);
        if (colindex !== -1) {
            this.columnTotals[colindex].value = elementValue;
            this.recalculateColumnTotals();
        }
    }

    // Separators
    public separators(props: {
        columns?: number[];
        rows?: number[];
        color?: string;
    }): void {
        if (!this.grid) return;

        const style = document.createElement('style');
        style.type = 'text/css';
        const color = props.color || '#212C4C';
        let generatedStyles = '';

        if (Array.isArray(props.columns)) {
            for (const colIndex of props.columns) {
                generatedStyles += `.separator-column-${colIndex} tr > :nth-child(${colIndex}) { border-right: 1px solid ${color}; } `;
                this.grid.classList.add(`separator-column-${colIndex}`);
            }
        }

        if (Array.isArray(props.rows)) {
            for (const rowIndex of props.rows) {
                generatedStyles += `.separator-row-${rowIndex} tr:nth-of-type(${rowIndex}) { border-bottom: 1px solid ${color}; } `;
                this.grid.classList.add(`separator-row-${rowIndex}`);
            }
        }

        style.innerHTML = generatedStyles;
        document.head.appendChild(style);
    }

    // Row totals calculation
    private recalculateRowTotals(): void {
        if (!this.grid) return;

        const rowCount = this.grid.rows.length;
        let grandTotal = 0;

        for (let row = 1; row < rowCount; row++) {
            let rowTotal = 0;

            const rowEx = this.properties.totals?.rows?.exceptions;
            if (Array.isArray(rowEx) && rowEx.indexOf(row) >= 0) {
                continue;
            }

            for (let k = 0; k < this.rowTotals.length; k++) {
                const entry = this.rowTotals[k];

                const colEx = this.properties.totals?.columns?.exceptions;
                if (Array.isArray(colEx) && colEx.indexOf(entry.column) >= 0) {
                    continue;
                }

                if (entry.row !== row) continue;
                if (this.excludeRowReadOnly && entry.readonly) continue;

                rowTotal += Number(entry.value) || 0;
            }

            const totalDiv = this.grid.querySelector(
                `div[data-rownumber="${row}"]`,
            );
            if (totalDiv) {
                totalDiv.innerHTML = `${rowTotal}`;
            }

            grandTotal += rowTotal;
        }

        this.updateGrandTotal(grandTotal);
    }

    // Column totals calculation
    private recalculateColumnTotals(): void {
        if (!this.grid || this.grid.rows.length === 0) return;

        const columnCount = this.grid.rows[0].cells.length;
        let grandTotal = 0;

        for (let column = 0; column < columnCount; column++) {
            let colTotal = 0;

            for (let j = 0; j < this.columnTotals.length; j++) {
                const rowEntry = this.rowTotals[j]; // May be undefined if arrays differ in length

                const colEx = this.properties.totals?.columns?.exceptions;
                if (
                    Array.isArray(colEx) &&
                    rowEntry &&
                    colEx.indexOf(rowEntry.column) >= 0
                ) {
                    continue;
                }

                const rowEx = this.properties.totals?.rows?.exceptions;
                if (
                    Array.isArray(rowEx) &&
                    rowEntry &&
                    rowEx.indexOf(rowEntry.row) >= 0
                ) {
                    continue;
                }

                if (this.columnTotals[j].column !== column) continue;
                if (this.excludeColumnReadOnly && this.columnTotals[j].readonly)
                    continue;

                colTotal += Number(this.columnTotals[j].value) || 0;
            }

            const totalDiv = this.grid.querySelector(
                `div[data-colnumber="${column}"]`,
            );
            if (totalDiv) {
                totalDiv.innerHTML = `<span>${colTotal}</span>`;
            }

            grandTotal += colTotal;
        }

        this.updateGrandTotal(grandTotal);
    }

    private updateGrandTotal(grandTotal: number): void {
        if (!this.hasGrandTotal || !this.grid) return;
        const grand = this.grid.querySelector('div.a-label-total-grand');
        if (grand) {
            grand.innerHTML = `${grandTotal}`;
        }
    }

    // Caption placement
    public caption(props: CaptionProps | string): void {
        if (!this.grid) return;

        let captionProps: CaptionProps;
        if (typeof props === 'string') {
            this.debug(
                `${this.id || 'o-question-grid'} did not correctly define caption properties.`,
                2,
            );
            captionProps = { content: props };
        } else {
            captionProps = props || {};
        }

        const headingRow = this.grid.querySelector(
            'tr.m-structure-row-heading',
        ) as HTMLTableRowElement | null;

        if (this.grid.rows.length === 2 && headingRow) {
            this.addSingleRowCaption(captionProps);
            return;
        }

        if (this.grid.rows[0] && this.grid.rows[0].cells.length === 2) {
            this.addSingleColumnCaption(captionProps);
            return;
        }

        this.addTableCaption(captionProps);
    }

    private addTableCaption(caption: CaptionProps): void {
        if (!this.grid) return;

        const captionContentContainer = document.createElement('span');
        captionContentContainer.classList.add('a-label-caption');
        captionContentContainer.innerHTML = this.replaceHTMLPlaceholder(
            caption.content,
        );

        const newCaption = this.grid.createCaption();

        if (caption.width) {
            (newCaption as HTMLTableCaptionElement).style.width = caption.width;
        }

        if (caption.align) {
            newCaption.classList.add(`align-${caption.align}`);
        }

        newCaption.appendChild(captionContentContainer);
    }

    private addSingleRowCaption(caption: CaptionProps): void {
        if (!this.grid) return;

        const captionContentContainer = document.createElement('span');
        captionContentContainer.classList.add('a-label-caption');
        captionContentContainer.innerHTML = this.replaceHTMLPlaceholder(
            caption.content,
        );

        if (caption.width) {
            (captionContentContainer as HTMLElement).style.width =
                caption.width;
        }

        if (caption.align) {
            captionContentContainer.classList.add(`align-${caption.align}`);
        }

        const headerRow = this.grid.rows[0];
        const newTH = document.createElement('th');
        newTH.scope = 'col';
        headerRow.insertBefore(newTH, headerRow.firstChild);

        const captionRow = this.grid.rows[1];
        const captionCell = document.createElement('th');
        captionCell.scope = 'row';
        captionCell.className = 'm-structure-cell m-structure-column-caption';
        captionCell.appendChild(captionContentContainer);
        captionRow.insertBefore(captionCell, captionRow.firstChild);
    }

    private addSingleColumnCaption(caption: CaptionProps): void {
        if (!this.grid) return;

        const captionContentContainer = document.createElement('span');
        captionContentContainer.classList.add('a-label-caption');
        captionContentContainer.innerHTML = this.replaceHTMLPlaceholder(
            caption.content,
        );

        if (caption.width) {
            (captionContentContainer as HTMLElement).style.width =
                caption.width;
        }

        if (caption.align) {
            captionContentContainer.classList.add(`align-${caption.align}`);
        }

        const captionRow = this.grid.insertRow(0);
        captionRow.className = 'm-structure-caption-row';

        const newTH = document.createElement('th');
        newTH.scope = 'col';
        captionRow.appendChild(newTH);

        const captionCell = newTH.cloneNode() as HTMLTableCellElement;
        captionCell.className = 'm-structure-cell m-structure-column-caption';
        captionCell.appendChild(captionContentContainer);
        captionRow.appendChild(captionCell);
    }

    // Totals configuration
    private configureRowTotals(props: TotalsProps): void {
        if (!props.visible || !this.grid) {
            return;
        }

        let captionTitle = '';
        let captionAlign = '';
        let captionWidth = '';

        const figureAlign = props.align ?? 'default';
        const figureWidth = props.width ? `width: ${props.width}` : '';

        if (props.caption) {
            if (typeof props.caption.content !== 'undefined') {
                captionTitle = props.caption.content || '';
            }
            if (typeof props.caption.align !== 'undefined') {
                captionAlign = props.caption.align || '';
            }
            if (typeof props.caption.width !== 'undefined') {
                captionWidth = props.caption.width || '';
            }
        }

        const headingRow = this.grid.querySelector(
            'tr.m-structure-row-heading',
        );

        // Add heading row if required by caption but not present
        if (!headingRow && captionTitle.length > 0 && this.grid.rows[1]) {
            const captionRow = this.grid.insertRow(0);
            captionRow.className = 'm-structure-caption-row';

            const newTH = document.createElement('th');
            newTH.scope = 'col';
            newTH.colSpan = this.grid.rows[1].cells.length;
            captionRow.appendChild(newTH);
        }

        const rowCount = this.grid.rows.length;

        for (let i = 0; i < rowCount; i++) {
            const totalCell = this.grid.rows[i].insertCell(-1);

            if (i === 0) {
                totalCell.scope = 'col';
                totalCell.className = 'm-structure-cell grid-row-total-title';
                if (captionAlign)
                    totalCell.classList.add(`align-${captionAlign}`);
                if (captionWidth)
                    (totalCell as HTMLElement).style.width = captionWidth;
                totalCell.innerHTML = this.replaceHTMLPlaceholder(captionTitle);
            } else {
                totalCell.className = 'm-structure-cell grid-row-total';
                totalCell.classList.add(`align-${figureAlign}`);

                if (
                    this.grid.rows[i].classList.contains(
                        'm-structure-row-error',
                    )
                ) {
                    continue;
                }

                if (
                    Array.isArray(props.exceptions) &&
                    props.exceptions.indexOf(i) >= 0
                ) {
                    continue;
                }

                let htmlString = '';

                if (props.labels?.pre) {
                    htmlString += `<span class="a-label-prelabel">${props.labels.pre}</span>`;
                }

                htmlString += `<div class="a-label-total-row a-label-total" data-rownumber="${i}" style="${figureWidth}"><span>0</span></div>`;

                if (props.labels?.post) {
                    htmlString += `<span class="a-label-postlabel">${props.labels.post}</span>`;
                }

                totalCell.innerHTML = htmlString;
            }
        }

        this.hasRowTotals = true;
    }

    private configureColumnTotals(props: TotalsProps): void {
        if (!props.visible || !this.grid || !this.grid.rows[0]) {
            return;
        }

        const columnCount = this.grid.rows[0].cells.length;
        const totalRow = this.grid.insertRow(-1);
        totalRow.className = 'm-structure-column-totals';

        let captionTitle = '';
        let captionAlign = '';
        let captionWidth = '';

        const figureAlign = props.align ?? 'default';
        const figureWidth = props.width ? `width: ${props.width}` : '';

        if (props.caption) {
            if (typeof props.caption.content !== 'undefined') {
                captionTitle = props.caption.content || '';
            }
            if (typeof props.caption.align !== 'undefined') {
                captionAlign = props.caption.align || '';
            }
            if (typeof props.caption.width !== 'undefined') {
                captionWidth = props.caption.width || '';
            }
        }

        for (let i = 0; i < columnCount; i++) {
            const totalCell = totalRow.insertCell(i);

            if (i === 0) {
                totalCell.scope = 'row';
                totalCell.className =
                    'm-structure-cell grid-column-total-title';
                if (captionAlign)
                    totalCell.classList.add(`align-${captionAlign}`);
                if (captionWidth)
                    (totalCell as HTMLElement).style.width = captionWidth;
                totalCell.innerHTML = this.replaceHTMLPlaceholder(captionTitle);
            } else {
                if (this.hasRowTotals && i === columnCount - 1) {
                    // grand total at the last cell
                    this.hasGrandTotal = true;
                    totalCell.className =
                        'm-structure-cell m-structure-cell-total grid-grandtotal';
                    totalCell.innerHTML =
                        '<div class="a-label-total-grand a-label-total"><span>0</span></div>';
                } else {
                    totalCell.className = 'm-structure-cell grid-column-total';
                    totalCell.classList.add(`align-${figureAlign}`);

                    if (
                        Array.isArray(props.exceptions) &&
                        props.exceptions.indexOf(i) >= 0
                    ) {
                        continue;
                    }

                    let htmlString = '';

                    if (props.labels?.pre) {
                        htmlString += `<span class="a-label-prelabel">${props.labels.pre}</span>`;
                    }

                    htmlString += `<div class="a-label-total-column a-label-total" data-colnumber="${i}" style="${figureWidth}"><span>0</span></div>`;

                    if (props.labels?.post) {
                        htmlString += `<span class="a-label-postlabel">${props.labels.post}</span>`;
                    }

                    totalCell.innerHTML =
                        this.replaceHTMLPlaceholder(htmlString);
                }
            }
        }
    }
}
