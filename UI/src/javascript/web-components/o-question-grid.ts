import Component from './component';

export interface CaptionProps {
    content?: string;
    align?: 'left' | 'right' | 'center' | 'default' | string;
    width?: string;
}

export interface LabelProps {
    pre?: string;
    post?: string;
}

export interface TotalsProps {
    visible?: boolean;
    excludereadonly?: boolean;
    align?: 'left' | 'right' | 'center' | 'default' | string;
    width?: string;
    caption?: CaptionProps;
    labels?: LabelProps;
    exceptions?: number[];
}

export interface GridTotalsProps {
    rows?: TotalsProps;
    columns?: TotalsProps;
}

export interface GridProperties {
    totals?: GridTotalsProps;
}

type TotalEntry = {
    id: string;
    value: number;
    column: number;
    row: number;
    readonly: boolean;
};

export default class OQuestionGrid extends Component {
    private grid: HTMLTableElement | null = null;
    private hasrowtotals = false;
    private rowtotals: TotalEntry[] = [];
    private excludeRowReadOnly = true;
    private excludeColumnReadOnly = true;
    private columntotals: TotalEntry[] = [];
    private hasgrandtotal = false;

    public properties: GridProperties = {};

    constructor() {
        super();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.loadPropertiesFromAttributes();
        this.init();
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

    // Initialization
    private init(): void {
        if (!this.grid) return;

        this.configureCellEvents();
        this.configureRowStyles();
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
    public topheadings(
        props: Array<{ caption: string; colspan?: number }>,
    ): void {
        if (!this.grid || !Array.isArray(props) || props.length === 0) return;

        const headingrow = this.grid.insertRow(0);
        headingrow.className = 'm-structure-caption-row';

        for (let i = 0; i < props.length; i++) {
            const newth = document.createElement('th');
            newth.scope = 'col';
            newth.innerHTML = `<span class="a-label-caption">${props[i].caption ?? ''}</span>`;
            newth.colSpan = props[i].colspan ?? 1;
            newth.className = 'm-structure-cell m-structure-heading';
            headingrow.appendChild(newth);
        }
    }

    // Row styling
    private configureRowStyles(): void {
        if (!this.grid) return;

        const tablerowlist = this.grid.querySelectorAll(
            'tr.m-structure-row, tr.m-structure-row-error',
        );
        let stripedrowiterator = 0;

        for (let i = 0; i < tablerowlist.length; i++) {
            const row = tablerowlist[i] as HTMLTableRowElement;
            if (row.classList.contains('m-structure-row-error')) {
                continue;
            }

            stripedrowiterator++;

            if (stripedrowiterator % 2 !== 0) {
                row.classList.add('striped');

                if (
                    typeof tablerowlist[i - 1] !== 'undefined' &&
                    tablerowlist[i - 1].classList.contains(
                        'm-structure-row-error',
                    )
                ) {
                    tablerowlist[i - 1].classList.add('striped');
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

                        const input = this.getElementsByTagName('INPUT')[0];
                        const button = this.getElementsByTagName('BUTTON')[0];
                        const textarea =
                            this.getElementsByTagName('TEXTAREA')[0];

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
                            const label = this.getElementsByTagName('LABEL')[0];
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
        headercolumn?: boolean;
        altcolumns?: boolean;
        headerrow?: boolean;
        altrows?: boolean;
    }): void {
        if (!this.grid) return;

        if (props.headercolumn === true) {
            this.grid.classList.add('shade-headercolumn');
        }

        if (props.altcolumns === true) {
            this.grid.classList.add('shade-altcolumns');
        }

        if (props.headerrow === true) {
            this.grid.classList.add('shade-headerrow');
        }

        if (props.altrows === true) {
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
            this.rowtotals = [];
            this.getTableInputElements('row');
            this.recalculateRowTotals();
        }

        if (props.columns && props.columns.visible) {
            this.excludeColumnReadOnly = props.columns.excludereadonly ?? true;
            this.configureColumnTotals(props.columns);
            this.columntotals = [];
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
                const inputelement = col.querySelector(
                    'input',
                ) as HTMLInputElement | null;
                if (inputelement) {
                    const details: TotalEntry = {
                        id: inputelement.id,
                        value: Number(inputelement.value) || 0,
                        column: j,
                        row: i,
                        readonly: !!inputelement.readOnly,
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
        const elementvalue = Number((element as HTMLInputElement).value) || 0;

        const rowindex = this.rowtotals.map((e) => e.id).indexOf(id);
        if (rowindex !== -1) {
            this.rowtotals[rowindex].value = elementvalue;
            this.recalculateRowTotals();
        }

        const colindex = this.columntotals.map((e) => e.id).indexOf(id);
        if (colindex !== -1) {
            this.columntotals[colindex].value = elementvalue;
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
        let generatedstyles = '';

        if (Array.isArray(props.columns)) {
            for (const colIndex of props.columns) {
                generatedstyles += `.separator-column-${colIndex} tr > :nth-child(${colIndex}) { border-right: 1px solid ${color}; } `;
                this.grid.classList.add(`separator-column-${colIndex}`);
            }
        }

        if (Array.isArray(props.rows)) {
            for (const rowIndex of props.rows) {
                generatedstyles += `.separator-row-${rowIndex} tr:nth-of-type(${rowIndex}) { border-bottom: 1px solid ${color}; } `;
                this.grid.classList.add(`separator-row-${rowIndex}`);
            }
        }

        style.innerHTML = generatedstyles;
        document.head.appendChild(style);
    }

    // Row totals calculation
    private recalculateRowTotals(): void {
        if (!this.grid) return;

        const rowcount = this.grid.rows.length;
        let grandtotal = 0;

        for (let row = 1; row < rowcount; row++) {
            let rowtotal = 0;

            const rowEx = this.properties.totals?.rows?.exceptions;
            if (Array.isArray(rowEx) && rowEx.indexOf(row) >= 0) {
                continue;
            }

            for (let k = 0; k < this.rowtotals.length; k++) {
                const entry = this.rowtotals[k];

                const colEx = this.properties.totals?.columns?.exceptions;
                if (Array.isArray(colEx) && colEx.indexOf(entry.column) >= 0) {
                    continue;
                }

                if (entry.row !== row) continue;
                if (this.excludeRowReadOnly && entry.readonly) continue;

                rowtotal += Number(entry.value) || 0;
            }

            const totalDiv = this.grid.querySelector(
                `div[data-rownumber="${row}"]`,
            );
            if (totalDiv) {
                totalDiv.innerHTML = `${rowtotal}`;
            }

            grandtotal += rowtotal;
        }

        this.updateGrandTotal(grandtotal);
    }

    // Column totals calculation
    private recalculateColumnTotals(): void {
        if (!this.grid || this.grid.rows.length === 0) return;

        const columncount = this.grid.rows[0].cells.length;
        let grandtotal = 0;

        for (let column = 0; column < columncount; column++) {
            let coltotal = 0;

            for (let j = 0; j < this.columntotals.length; j++) {
                const rowEntry = this.rowtotals[j]; // May be undefined if arrays differ in length

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

                if (this.columntotals[j].column !== column) continue;
                if (this.excludeColumnReadOnly && this.columntotals[j].readonly)
                    continue;

                coltotal += Number(this.columntotals[j].value) || 0;
            }

            const totalDiv = this.grid.querySelector(
                `div[data-colnumber="${column}"]`,
            );
            if (totalDiv) {
                totalDiv.innerHTML = `<span>${coltotal}</span>`;
            }

            grandtotal += coltotal;
        }

        this.updateGrandTotal(grandtotal);
    }

    private updateGrandTotal(grandtotal: number): void {
        if (!this.hasgrandtotal || !this.grid) return;
        const grand = this.grid.querySelector('div.a-label-total-grand');
        if (grand) {
            grand.innerHTML = `${grandtotal}`;
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

        const headingrow = this.grid.querySelector(
            'tr.m-structure-row-heading',
        ) as HTMLTableRowElement | null;

        if (this.grid.rows.length === 2 && headingrow) {
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

        const captioncontentcontainer = document.createElement('span');
        captioncontentcontainer.classList.add('a-label-caption');
        captioncontentcontainer.innerHTML = this.replaceHTMLPlaceholder(
            caption.content,
        );

        const newcaption = this.grid.createCaption();

        if (caption.width) {
            (newcaption as HTMLTableCaptionElement).style.width = caption.width;
        }

        if (caption.align) {
            newcaption.classList.add(`align-${caption.align}`);
        }

        newcaption.appendChild(captioncontentcontainer);
    }

    private addSingleRowCaption(caption: CaptionProps): void {
        if (!this.grid) return;

        const captioncontentcontainer = document.createElement('span');
        captioncontentcontainer.classList.add('a-label-caption');
        captioncontentcontainer.innerHTML = this.replaceHTMLPlaceholder(
            caption.content,
        );

        if (caption.width) {
            (captioncontentcontainer as HTMLElement).style.width =
                caption.width;
        }

        if (caption.align) {
            captioncontentcontainer.classList.add(`align-${caption.align}`);
        }

        const headerrow = this.grid.rows[0];
        const newth = document.createElement('th');
        newth.scope = 'col';
        headerrow.insertBefore(newth, headerrow.firstChild);

        const captionrow = this.grid.rows[1];
        const captioncell = document.createElement('th');
        captioncell.scope = 'row';
        captioncell.className = 'm-structure-cell m-structure-column-caption';
        captioncell.appendChild(captioncontentcontainer);
        captionrow.insertBefore(captioncell, captionrow.firstChild);
    }

    private addSingleColumnCaption(caption: CaptionProps): void {
        if (!this.grid) return;

        const captioncontentcontainer = document.createElement('span');
        captioncontentcontainer.classList.add('a-label-caption');
        captioncontentcontainer.innerHTML = this.replaceHTMLPlaceholder(
            caption.content,
        );

        if (caption.width) {
            (captioncontentcontainer as HTMLElement).style.width =
                caption.width;
        }

        if (caption.align) {
            captioncontentcontainer.classList.add(`align-${caption.align}`);
        }

        const captionrow = this.grid.insertRow(0);
        captionrow.className = 'm-structure-caption-row';

        const newth = document.createElement('th');
        newth.scope = 'col';
        captionrow.appendChild(newth);

        const captioncell = newth.cloneNode() as HTMLTableCellElement;
        captioncell.className = 'm-structure-cell m-structure-column-caption';
        captioncell.appendChild(captioncontentcontainer);
        captionrow.appendChild(captioncell);
    }

    // Totals configuration
    private configureRowTotals(props: TotalsProps): void {
        if (!props.visible || !this.grid) {
            return;
        }

        let captiontitle = '';
        let captionalign = '';
        let captionwidth = '';

        const figurealign = props.align ?? 'default';
        const figurewidth = props.width ? `width: ${props.width}` : '';

        if (props.caption) {
            if (typeof props.caption.content !== 'undefined') {
                captiontitle = props.caption.content || '';
            }
            if (typeof props.caption.align !== 'undefined') {
                captionalign = props.caption.align || '';
            }
            if (typeof props.caption.width !== 'undefined') {
                captionwidth = props.caption.width || '';
            }
        }

        const headingrow = this.grid.querySelector(
            'tr.m-structure-row-heading',
        );

        // Add heading row if required by caption but not present
        if (!headingrow && captiontitle.length > 0 && this.grid.rows[1]) {
            const captionrow = this.grid.insertRow(0);
            captionrow.className = 'm-structure-caption-row';

            const newth = document.createElement('th');
            newth.scope = 'col';
            newth.colSpan = this.grid.rows[1].cells.length;
            captionrow.appendChild(newth);
        }

        const rowcount = this.grid.rows.length;

        for (let i = 0; i < rowcount; i++) {
            const totalcell = this.grid.rows[i].insertCell(-1);

            if (i === 0) {
                totalcell.scope = 'col';
                totalcell.className = 'm-structure-cell grid-row-total-title';
                if (captionalign)
                    totalcell.classList.add(`align-${captionalign}`);
                if (captionwidth)
                    (totalcell as HTMLElement).style.width = captionwidth;
                totalcell.innerHTML = this.replaceHTMLPlaceholder(captiontitle);
            } else {
                totalcell.className = 'm-structure-cell grid-row-total';
                totalcell.classList.add(`align-${figurealign}`);

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

                htmlString += `<div class="a-label-total-row a-label-total" data-rownumber="${i}" style="${figurewidth}"><span>0</span></div>`;

                if (props.labels?.post) {
                    htmlString += `<span class="a-label-postlabel">${props.labels.post}</span>`;
                }

                totalcell.innerHTML = htmlString;
            }
        }

        this.hasrowtotals = true;
    }

    private configureColumnTotals(props: TotalsProps): void {
        if (!props.visible || !this.grid || !this.grid.rows[0]) {
            return;
        }

        const columncount = this.grid.rows[0].cells.length;
        const totalrow = this.grid.insertRow(-1);
        totalrow.className = 'm-structure-column-totals';

        let captiontitle = '';
        let captionalign = '';
        let captionwidth = '';

        const figurealign = props.align ?? 'default';
        const figurewidth = props.width ? `width: ${props.width}` : '';

        if (props.caption) {
            if (typeof props.caption.content !== 'undefined') {
                captiontitle = props.caption.content || '';
            }
            if (typeof props.caption.align !== 'undefined') {
                captionalign = props.caption.align || '';
            }
            if (typeof props.caption.width !== 'undefined') {
                captionwidth = props.caption.width || '';
            }
        }

        for (let i = 0; i < columncount; i++) {
            const totalcell = totalrow.insertCell(i);

            if (i === 0) {
                totalcell.scope = 'row';
                totalcell.className =
                    'm-structure-cell grid-column-total-title';
                if (captionalign)
                    totalcell.classList.add(`align-${captionalign}`);
                if (captionwidth)
                    (totalcell as HTMLElement).style.width = captionwidth;
                totalcell.innerHTML = this.replaceHTMLPlaceholder(captiontitle);
            } else {
                if (this.hasrowtotals && i === columncount - 1) {
                    // grand total at the last cell
                    this.hasgrandtotal = true;
                    totalcell.className =
                        'm-structure-cell m-structure-cell-total grid-grandtotal';
                    totalcell.innerHTML =
                        '<div class="a-label-total-grand a-label-total"><span>0</span></div>';
                } else {
                    totalcell.className = 'm-structure-cell grid-column-total';
                    totalcell.classList.add(`align-${figurealign}`);

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

                    htmlString += `<div class="a-label-total-column a-label-total" data-colnumber="${i}" style="${figurewidth}"><span>0</span></div>`;

                    if (props.labels?.post) {
                        htmlString += `<span class="a-label-postlabel">${props.labels.post}</span>`;
                    }

                    totalcell.innerHTML =
                        this.replaceHTMLPlaceholder(htmlString);
                }
            }
        }
    }
}
