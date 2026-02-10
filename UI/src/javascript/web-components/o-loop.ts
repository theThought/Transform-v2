import Component from './component';
import { Observer, Subject } from '../interfaces';

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

export default class OLoop extends Component implements Subject, Observer {
    private table: HTMLTableElement | null = null;
    private hasRowTotals = false;
    private rowTotals: TotalEntry[] = [];
    private columnTotals: TotalEntry[] = [];
    private excludeRowReadOnly = true;
    private excludeColumnReadOnly = true;
    private hasGrandTotal = false;
    private observers: Observer[] = [];

    public properties: GridProperties = {};

    constructor() {
        super();
    }

    update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'clearValue':
                this.notifyObservers('clearValueFromExternal', data);
                break;
        }
    }

    public addObserver(observer: Observer): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: Observer): void {
        const index = this.observers.findIndex((obs) => obs === observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    public notifyObservers(method: string, detail: CustomEvent): void {
        this.observers.forEach((observer) => observer.update(method, detail));
    }

    protected setElement(): void {
        this.element = null;
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'questionChange':
                this.receiveBroadcast(e as CustomEvent);
                break;
            case 'exclusiveOn':
                this.exclusiveOn(e as CustomEvent);
                break;
        }
    }

    private exclusiveOn(e: CustomEvent): void {
        e.stopPropagation();
        this.notifyObservers('clearValue', e);
    }

    private replaceHTMLPlaceholder(content?: string): string {
        if (typeof content !== 'string') return '';
        // Placeholder for potential templating; currently returns as-is.
        return content;
    }

    // Heading utilities
    private configureTopHeadings(): void {
        if (
            !this.table ||
            !Array.isArray(this.properties.topheadings) ||
            !this.properties.topheadings.length
        )
            return;

        const headingRow = this.table.insertRow(0);
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
        if (!this.table) return;

        const tableRowList = this.table.querySelectorAll(
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

    // Shading toggles
    private configureCellShading(): void {
        if (!this.table) return;

        if (this.properties.cellshading?.headercolumn === true) {
            this.table.classList.add('shade-header-column');
        }

        if (this.properties.cellshading?.altcolumns === true) {
            this.table.classList.add('shade-alt-columns');
        }

        if (this.properties.cellshading?.headerrow === true) {
            this.table.classList.add('shade-header-row');
        }

        if (this.properties.cellshading?.altrows === true) {
            this.table.classList.add('shade-alt-rows');
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
        if (!this.table) return;

        for (
            let i = 0, row: HTMLTableRowElement | undefined;
            (row = this.table.rows[i]);
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

    private receiveBroadcast(e: CustomEvent): void {
        const detail = e.detail || {};

        const rowindex = this.rowTotals
            .map(function (detail) {
                return detail.id;
            })
            .indexOf(detail.element.id);

        const elementValue = Number(detail.element.value);

        if (rowindex !== -1) {
            this.rowTotals[rowindex].value = elementValue;
            this.recalculateRowTotals();
        }

        const colindex = this.columnTotals
            .map(function (detail) {
                return detail.id;
            })
            .indexOf(detail.element.id);

        if (colindex !== -1) {
            this.columnTotals[colindex].value = elementValue;
            this.recalculateColumnTotals();
        }
    }

    private setSeparatorStyle(): void {
        const items: NodeListOf<HTMLElement> = this.querySelectorAll(
            'o-question.question-no-separator > o-response',
        );
        if (!items) return;

        items.forEach((item) => {
            const questionGroup = item.dataset.questionGroup;
            if (!questionGroup) return;
            this.querySelector(
                'colgroup[data-question-group*="' + questionGroup + '"]',
            )?.classList.add('question-no-separator');
        });
    }

    // Separators
    public configureSeparators(): void {
        if (!this.table) return;

        const style = document.createElement('style');
        const color = this.properties.separators?.color || '#002554';
        let generatedStyles = '';

        if (Array.isArray(this.properties.separators?.columns)) {
            for (const colIndex of this.properties.separators?.columns) {
                generatedStyles += `.separator-column-${colIndex} tbody tr > :nth-child(${colIndex}) { border-right: .125rem solid ${color}; } `;
                this.table.classList.add(`separator-column-${colIndex}`);
            }
        }

        if (Array.isArray(this.properties.separators?.rows)) {
            for (const rowIndex of this.properties.separators?.rows) {
                generatedStyles += `.separator-row-${rowIndex} tbody tr:nth-of-type(${rowIndex}) { border-bottom: .125rem solid ${color}; } `;
                this.table.classList.add(`separator-row-${rowIndex}`);
            }
        }

        style.innerHTML = generatedStyles;
        document.head.appendChild(style);
    }

    // Row totals calculation
    private recalculateRowTotals(): void {
        if (!this.table) return;

        const rowCount = this.table.rows.length;
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

            const totalDiv = this.table.querySelector(
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
        if (!this.table || this.table.rows.length === 0) return;

        const columnCount = this.table.rows[0].cells.length;
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

            const totalDiv = this.table.querySelector(
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
        if (!this.hasGrandTotal || !this.table) return;
        const grand = this.table.querySelector('div.a-label-total-grand');
        if (grand) {
            grand.innerHTML = `${grandTotal}`;
        }
    }

    // Caption placement
    public configureTableCaption(): void {
        if (!this.table) return;
        if (!this.properties.caption) return;

        // check for the presence of a heading row
        const heading =
            this.table.querySelector('tr.m-structure-row-heading') || null;

        // add caption for tables with a heading row and a single row of data
        if (this.table.rows.length === 2 && heading) {
            this.addSingleRowCaption();
            return;
        }

        // add caption for tables with exactly one column of data
        if (this.table.dataset.questionCount === '1') {
            this.addSingleColumnCaption();
            return;
        }

        // add a conventional table caption
        this.addTableCaption();
    }

    private addTableCaption(): void {
        if (!this.table) return;

        const captionContent = this.createCaptionContent();
        const newCaption = this.table.createCaption();

        newCaption.appendChild(captionContent);
    }

    private addSingleRowCaption(): void {
        if (!this.table) return;

        const captionContent = this.createCaptionContent();

        // insert a blank cell at the start of the existing heading row
        const headerRow = this.table.rows[0];
        const newTH = document.createElement('th');
        newTH.scope = 'col';
        headerRow.insertBefore(newTH, headerRow.firstChild);

        // get the row that requires a caption and add a cell at the start
        const captionRow = this.table.rows[1];
        const captionCell = document.createElement('th');
        captionCell.scope = 'row';
        captionCell.className = 'm-structure-cell m-structure-column-caption';
        captionCell.appendChild(captionContent);
        captionRow.insertBefore(captionCell, captionRow.firstChild);
    }

    private addSingleColumnCaption(): void {
        if (!this.table) return;

        const captionContent = this.createCaptionContent();

        // get the column that requires a caption
        const columnCount = this.table.rows[0].cells.length;

        // insert a blank row at the start of the existing grid
        const captionRow = this.table.insertRow(0);
        captionRow.className = 'm-structure-caption-row';

        const newTH = document.createElement('th');
        newTH.scope = 'col';

        if (columnCount > 1) {
            // insert a blank cell at the start of the new row
            newTH.colSpan = columnCount - 1;
            captionRow.appendChild(newTH);
        }

        // insert the caption cell into the new row
        const captionCell = newTH.cloneNode() as HTMLTableCellElement;
        captionCell.colSpan = 1;
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
        if (!this.table || !this.properties.totals?.rows?.visible) {
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

        const headingRow = this.table.querySelector(
            'tr.m-structure-row-heading',
        );

        // Add a heading row if required
        if (!headingRow && captionTitle.length > 0 && this.table.rows[1]) {
            const captionRow = this.table.insertRow(0);
            captionRow.className = 'm-structure-caption-row';

            const newTH = document.createElement('th');
            newTH.scope = 'col';
            newTH.colSpan = this.table.rows[1].cells.length;
            captionRow.appendChild(newTH);
        }

        const rowCount = this.table.rows.length;

        for (let i = 0; i < rowCount; i++) {
            const totalCell = this.table.rows[i].insertCell(-1);
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
                    this.table.rows[i].classList.contains(
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
        if (!this.table || !this.properties.totals?.columns?.visible) {
            return;
        }

        const columnCount = this.table.rows[0].cells.length;
        const totalRow = this.table.insertRow(-1);
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

    public connectedCallback(): void {
        super.connectedCallback();

        if (this.response) this.response.addObserver(this);
        this.table = this.querySelector('table');

        this.configureTableCaption();
        this.configureTotals();
        this.configureTopHeadings();
        this.configureCellShading();
        this.configureRowStyles();
        this.configureSeparators();
        this.setSeparatorStyle();

        this.addEventListener('exclusiveOn', this.handleEvent);
        this.addEventListener('questionChange', this.handleEvent);
    }
}
