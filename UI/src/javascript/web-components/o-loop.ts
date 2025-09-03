import Component from './component';

interface CaptionProps {
    content?: string;
    align?: 'left' | 'right' | 'center' | 'default' | string;
    width?: string;
}

interface CellShadingProps {
    altcolumns?: boolean;
    altrows?: boolean;
    headercolumn?: boolean;
    headerrow?: boolean;
}

interface TopHeadingsCaptionProp {
    caption?: string;
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
    elementalign?: 'left' | 'right' | 'center' | 'default' | string; // input within column
    align?: 'left' | 'right' | 'center' | 'default' | string; // text within input
    width?: string;
    caption?: CaptionProps;
    labels?: LabelProps;
    exceptions?: number[];
}

interface GridTotalsProps {
    rows?: TotalsProps;
    columns?: TotalsProps;
}

interface GridSeparatorsProps {
    columns?: number[];
    rows?: number[];
    color?: string;
}

interface GridProperties {
    totals?: GridTotalsProps;
    cellshading?: CellShadingProps;
    topheadings?: TopHeadingsProps;
    separators?: GridSeparatorsProps;
    caption?: CaptionProps;
}

type TotalEntry = {
    id: string;
    value: number;
    column: number;
    row: number;
    readonly: boolean;
};

export default class OLoop extends Component {
    private element: HTMLTableElement | null = null;
    private hasRowTotals = false;
    private rowTotals: TotalEntry[] = [];
    private columnTotals: TotalEntry[] = [];
    private excludeRowReadOnly = true;
    private excludeColumnReadOnly = true;
    private hasGrandTotal = false;

    public properties: GridProperties = {};

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.loadPropertiesFromAttributes();

        this.element = this.querySelector('table');

        this.configureCellEvents();
        this.configureTableCaption();
        this.configureTotals();
        this.configureTopHeadings();
        this.configureCellShading();
        this.configureRowStyles();
        this.configureSeparators();

        this.addEventListener('questionChange', this.handleEvent);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'questionChange':
                this.receiveBroadcast(e as CustomEvent);
                break;
            default:
                break;
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
            console.warn(
                '[OQuestionGrid] Failed to parse properties JSON from attributes.',
            );
            this.properties = {};
        }
    }

    // Heading utilities
    private configureTopHeadings(): void {
        if (
            !this.element ||
            !Array.isArray(this.properties.topheadings) ||
            !this.properties.topheadings.length
        )
            return;

        const headingRow = this.element.insertRow(0);
        headingRow.className = 'm-structure-caption-row';

        for (let i = 0; i < this.properties.topheadings.length; i++) {
            const newTH = document.createElement('th');
            newTH.scope = 'col';
            newTH.innerHTML = `<span class="a-label-caption">${this.properties.topheadings[i].caption ?? ''}</span>`;
            newTH.colSpan = this.properties.topheadings[i].colspan ?? 1;
            newTH.className = 'm-structure-cell m-structure-heading';
            headingRow.appendChild(newTH);
        }
    }

    // Row styling - required to avoid double-striping when errors are present
    private configureRowStyles(): void {
        if (!this.element) return;

        const tableRowList = this.element.querySelectorAll(
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

    // Cell click handling
    private configureCellEvents(): void {
        if (!this.element) return;

        for (
            let i = 0, row: HTMLTableRowElement | undefined;
            (row = this.element.rows[i]);
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
    private configureCellShading(): void {
        if (!this.element) return;

        if (this.properties.cellshading?.headercolumn === true) {
            this.element.classList.add('shade-header-column');
        }

        if (this.properties.cellshading?.altcolumns === true) {
            this.element.classList.add('shade-alt-columns');
        }

        if (this.properties.cellshading?.headerrow === true) {
            this.element.classList.add('shade-header-row');
        }

        if (this.properties.cellshading?.altrows === true) {
            this.element.classList.add('shade-alt-rows');
        }
    }

    // Totals setup
    private configureTotals(): void {
        if (this.properties.totals?.rows?.visible) {
            this.excludeRowReadOnly =
                this.properties.totals?.rows.excludereadonly ?? true;
            this.configureRowTotals();
            this.getTableInputElements('row');
            this.recalculateRowTotals();
        }

        if (this.properties.totals?.columns?.visible) {
            this.excludeColumnReadOnly =
                this.properties.totals?.columns.excludereadonly ?? true;
            this.configureColumnTotals();
            this.getTableInputElements('column');
            this.recalculateColumnTotals();
        }
    }

    private getTableInputElements(direction: 'row' | 'column'): void {
        if (!this.element) return;

        for (
            let i = 0, row: HTMLTableRowElement | undefined;
            (row = this.element.rows[i]);
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
                        column: Number(col.dataset.x),
                        row: Number(col.dataset.y),
                        readonly: inputElement.readOnly,
                    };
                    this[`${direction}Totals`].push(details);
                }
            }
        }
    }

    private receiveBroadcast(event: CustomEvent): void {
        const detail = event.detail || {};
        const element = detail.element as HTMLElement | undefined;
        if (!element || element.tagName !== 'INPUT') {
            return;
        }

        const id = detail.element.id as string;
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
    public configureSeparators(): void {
        if (!this.element) return;

        const style = document.createElement('style');
        const color = this.properties.separators?.color || '#212C4C';
        let generatedStyles = '';

        if (Array.isArray(this.properties.separators?.columns)) {
            for (const colIndex of this.properties.separators?.columns) {
                generatedStyles += `.separator-column-${colIndex} tr > :nth-child(${colIndex}) { border-right: 1px solid ${color}; } `;
                this.element.classList.add(`separator-column-${colIndex}`);
            }
        }

        if (Array.isArray(this.properties.separators?.rows)) {
            for (const rowIndex of this.properties.separators?.rows) {
                generatedStyles += `.separator-row-${rowIndex} tr:nth-of-type(${rowIndex}) { border-bottom: 1px solid ${color}; } `;
                this.element.classList.add(`separator-row-${rowIndex}`);
            }
        }

        style.innerHTML = generatedStyles;
        document.head.appendChild(style);
    }

    // Row totals calculation
    private recalculateRowTotals(): void {
        if (!this.element) return;

        const rowCount = this.element.rows.length;
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

            const totalDiv = this.element.querySelector(
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
        if (!this.element || this.element.rows.length === 0) return;

        const columnCount = this.element.rows[0].cells.length;
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

            const totalDiv = this.element.querySelector(
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
        if (!this.hasGrandTotal || !this.element) return;
        const grand = this.element.querySelector('div.a-label-total-grand');
        if (grand) {
            grand.innerHTML = `${grandTotal}`;
        }
    }

    // Caption placement
    public configureTableCaption(): void {
        if (!this.element) return;
        if (!this.properties.caption) return;

        // check for the presence of a heading row
        const heading =
            this.element.querySelector('tr.m-structure-row-heading') || null;

        // add caption for tables with a heading row and a single row of data
        if (this.element.rows.length === 2 && heading) {
            this.addSingleRowCaption();
            return;
        }

        // add caption for tables with exactly two columns
        if (this.element.rows[0] && this.element.rows[0].cells.length === 2) {
            this.addSingleColumnCaption();
            return;
        }

        // add a conventional table caption
        this.addTableCaption();
    }

    private addTableCaption(): void {
        if (!this.element) return;

        const captionContent = this.createCaptionContent();
        const newCaption = this.element.createCaption();

        newCaption.appendChild(captionContent);
    }

    private addSingleRowCaption(): void {
        if (!this.element) return;

        const captionContent = this.createCaptionContent();

        // insert a blank cell at the start of the existing heading row
        const headerRow = this.element.rows[0];
        const newTH = document.createElement('th');
        newTH.scope = 'col';
        headerRow.insertBefore(newTH, headerRow.firstChild);

        // get the row that requires a caption and add a cell at the start
        const captionRow = this.element.rows[1];
        const captionCell = document.createElement('th');
        captionCell.scope = 'row';
        captionCell.className = 'm-structure-cell m-structure-column-caption';
        captionCell.appendChild(captionContent);
        captionRow.insertBefore(captionCell, captionRow.firstChild);
    }

    private addSingleColumnCaption(): void {
        if (!this.element) return;

        const captionContent = this.createCaptionContent();

        // insert a blank row at the start of the existing grid
        const captionRow = this.element.insertRow(0);
        captionRow.className = 'm-structure-caption-row';

        // insert a blank cell at the start of the new row
        const newTH = document.createElement('th');
        newTH.scope = 'col';
        captionRow.appendChild(newTH);

        // insert the caption cell into the new row
        const captionCell = newTH.cloneNode() as HTMLTableCellElement;
        captionCell.className = 'm-structure-cell m-structure-column-caption';
        captionCell.appendChild(captionContent);
        captionRow.appendChild(captionCell);
    }

    private createCaptionContent(): HTMLSpanElement {
        const captionContentContainer = document.createElement('span');
        captionContentContainer.classList.add('a-label-caption');
        captionContentContainer.innerHTML = this.replaceHTMLPlaceholder(
            this.properties.caption?.content,
        );

        if (this.properties.caption?.width) {
            (captionContentContainer as HTMLElement).style.width =
                this.properties.caption?.width;
        }

        if (this.properties.caption?.align) {
            captionContentContainer.classList.add(
                `align-${this.properties.caption?.align}`,
            );
        }

        return captionContentContainer;
    }

    // Totals configuration
    private configureRowTotals(): void {
        if (!this.element || !this.properties.totals?.rows?.visible) {
            return;
        }

        const columnAlign =
            this.properties.totals?.rows?.elementalign ?? 'default';
        const figureAlign = this.properties.totals?.rows?.align
            ? `text-align: ${this.properties.totals?.rows?.align};`
            : '';
        const figureWidth = this.properties.totals?.rows?.width
            ? `width: ${this.properties.totals?.rows?.width};`
            : '';

        const captionTitle =
            this.properties.totals?.rows?.caption?.content || '';
        const captionAlign = this.properties.totals?.rows?.caption?.align || '';
        const captionWidth = this.properties.totals?.rows?.caption?.width || '';

        const headingRow = this.element.querySelector(
            'tr.m-structure-row-heading',
        );

        // Add a heading row if required
        if (!headingRow && captionTitle.length > 0 && this.element.rows[1]) {
            const captionRow = this.element.insertRow(0);
            captionRow.className = 'm-structure-caption-row';

            const newTH = document.createElement('th');
            newTH.scope = 'col';
            newTH.colSpan = this.element.rows[1].cells.length;
            captionRow.appendChild(newTH);
        }

        const rowCount = this.element.rows.length;

        for (let i = 0; i < rowCount; i++) {
            const totalCell = this.element.rows[i].insertCell(-1);
            totalCell.classList.add('m-structure-cell');

            if (i === 0) {
                const totalTH = document.createElement('th');
                // caption in the first row
                totalTH.scope = 'col';
                totalTH.classList.add('grid-row-total-title');
                if (captionAlign) {
                    totalTH.classList.add(`align-${captionAlign}`);
                }
                if (captionWidth) totalTH.style.width = captionWidth;
                totalTH.innerHTML = this.replaceHTMLPlaceholder(captionTitle);
                totalCell.replaceWith(totalTH);
            } else {
                // regular total in other rows, avoiding any error rows
                // and skipping exclusion rows

                if (
                    this.element.rows[i].classList.contains(
                        'm-structure-row-error',
                    )
                ) {
                    continue;
                }

                if (
                    Array.isArray(this.properties.totals?.rows?.exceptions) &&
                    this.properties.totals?.rows?.exceptions.indexOf(i) >= 0
                ) {
                    continue;
                }

                totalCell.classList.add('grid-row-total');
                totalCell.classList.add(`align-${columnAlign}`);

                let htmlString = '';
                const totalWrapper = document.createElement('div');
                totalWrapper.className = 'm-grid-total';

                if (this.properties.totals?.rows?.labels?.pre) {
                    htmlString += `<span class="a-label-pre">${this.properties.totals?.rows?.labels.pre}</span>`;
                }

                htmlString += `<div class="a-label-total-row a-label-total" data-rownumber="${i}" style="${figureWidth} ${figureAlign}"><span>0</span></div>`;

                if (this.properties.totals?.rows?.labels?.post) {
                    htmlString += `<span class="a-label-post">${this.properties.totals?.rows?.labels.post}</span>`;
                }

                totalWrapper.innerHTML = htmlString;
                totalCell.appendChild(totalWrapper);
            }
        }

        this.hasRowTotals = true;
    }

    private configureColumnTotals(): void {
        if (!this.element || !this.properties.totals?.columns?.visible) {
            return;
        }

        const columnCount = this.element.rows[0].cells.length;
        const totalRow = this.element.insertRow(-1);
        totalRow.className = 'm-structure-column-totals';

        const columnAlign =
            this.properties.totals?.columns?.elementalign ?? 'default';
        const figureAlign = this.properties.totals?.columns?.align
            ? `text-align: ${this.properties.totals?.columns?.align};`
            : '';
        const figureWidth = this.properties.totals?.columns?.width
            ? `width: ${this.properties.totals?.columns?.width};`
            : '';

        const captionTitle =
            this.properties.totals?.columns?.caption?.content || '';
        const captionAlign =
            this.properties.totals?.columns?.caption?.align || '';
        const captionWidth =
            this.properties.totals?.columns?.caption?.width || '';

        for (let i = 0; i < columnCount; i++) {
            const totalCell = totalRow.insertCell(i);
            totalCell.classList.add('m-structure-cell');

            if (i === 0) {
                // caption in the first column
                const totalTH = document.createElement('th');
                totalTH.scope = 'row';
                totalTH.classList.add('grid-column-total-title');
                if (captionAlign)
                    totalTH.classList.add(`align-${captionAlign}`);
                if (captionWidth) totalTH.style.width = captionWidth;
                totalTH.innerHTML = this.replaceHTMLPlaceholder(captionTitle);
                totalCell.replaceWith(totalTH);
            } else {
                if (this.hasRowTotals && i === columnCount - 1) {
                    // grand total in the last column
                    this.hasGrandTotal = true;
                    totalCell.classList.add('m-structure-cell-total');
                    totalCell.classList.add('grid-grandtotal');
                    totalCell.classList.add(`align-${columnAlign}`);
                    totalCell.innerHTML =
                        '<div class="a-label-total-grand a-label-total"><span>0</span></div>';
                } else {
                    // regular total in other columns
                    totalCell.classList.add('grid-column-total');
                    totalCell.classList.add(`align-${columnAlign}`);

                    if (
                        Array.isArray(
                            this.properties.totals?.columns?.exceptions,
                        ) &&
                        this.properties.totals?.columns?.exceptions.indexOf(
                            i,
                        ) >= 0
                    ) {
                        continue;
                    }

                    let htmlString = '';
                    const totalWrapper = document.createElement('div');
                    totalWrapper.className = 'm-grid-total';

                    if (this.properties.totals?.columns?.labels?.pre) {
                        htmlString += `<span class="a-label-pre">${this.properties.totals?.columns?.labels.pre}</span>`;
                    }

                    htmlString += `<div class="a-label-total-column a-label-total" data-colnumber="${i}" style="${figureWidth} ${figureAlign}"><span>0</span></div>`;

                    if (this.properties.totals?.columns?.labels?.post) {
                        htmlString += `<span class="a-label-post">${this.properties.totals?.columns?.labels.post}</span>`;
                    }

                    totalWrapper.innerHTML = htmlString;
                    totalCell.appendChild(totalWrapper);
                }
            }
        }
    }
}
