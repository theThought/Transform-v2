import Component from './component';
import OLoop from './o-palette-loop';

export default class OHistory extends Component {
    public values: Array<HTMLInputElement> = [];
    private EmptyMessage: HTMLElement | null = null;
    private HistoryDestination: HTMLElement | null = null;
    private AnswerCount = 0;
    private loop: OLoop | null = null;

    private createHistoryEntry(
        rowData: Map<string, string>,
        rowIndex: number,
    ): void {
        if (!this.HistoryDestination) {
            return;
        }
        
        if (rowData.size === 0) {
            return;
        }

        const historyEntry = document.createElement('o-palette-history-entry');

        // Store each field value as a data attribute with key data-{associateControl}
        rowData.forEach((value, associateControl) => {
            historyEntry.setAttribute(`data-${associateControl}`, value);
        });

        historyEntry.setAttribute('data-index', rowIndex.toString());
        this.HistoryDestination.appendChild(historyEntry);
        this.AnswerCount++;
    }

    private updateEmptyMessage(): void {
        this.EmptyMessage?.classList.toggle('inactive', this.AnswerCount > 0);
    }

    private layoutValues(): void {
        if (!this.loop) return;

        // Group inputs by row and collect all values with their associate-questions
        const rows =
            this.loop.values[0]?.closest('tbody')?.querySelectorAll('tr') || [];

        rows.forEach((row, rowIndex) => {
            const rowData = new Map<string, string>();
            let hasData = false;

            row.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
                if (input.value.trim()) {
                    const response = input.closest('o-response');
                    const associateQuestion =
                        response?.dataset.associateQuestion;
                    if (associateQuestion) {
                        rowData.set(associateQuestion, input.value);
                        hasData = true;
                    }
                }
            });

            if (hasData) {
                this.createHistoryEntry(rowData, rowIndex);
            }
        });
    }

    public getAnswerCount(): number {
        return this.AnswerCount;
    }

    private displayValues(): void {
        this.values.forEach((input) => {
            if (!input.value.length) return;
        });
    }

    private configureEmptyMessage(): void {
        this.EmptyMessage = this.querySelector('.history-empty');
        this.EmptyMessage?.classList.add('inactive');

        this.updateEmptyMessage();
    }

    private retrieveHistoryTemplate(): void {}

    private setHistoryOutputLocation(): void {
        this.HistoryDestination = this.querySelector('.l-row-history');
    }

    private handleRecordCommitted = (event: Event): void => {
        const customEvent = event as CustomEvent;
        const detail = customEvent.detail;
        
        if (!detail || !detail.row) {
            return;
        }
        
        const row = detail.row as HTMLTableRowElement;
        const tbody = row.closest('tbody');
        const rowIndex = tbody ? Array.from(tbody.querySelectorAll('tr')).indexOf(row) : -1;

        // Collect all field values from the submitted row
        const rowData = new Map<string, string>();
        row.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
            if (input.value.trim()) {
                const response = input.closest('o-response');
                const associateQuestion = response?.dataset.associateQuestion;
                if (associateQuestion) {
                    rowData.set(associateQuestion, input.value);
                }
            }
        });

        if (rowData.size > 0) {
            this.createHistoryEntry(rowData, rowIndex);
            this.updateEmptyMessage();
        }
    };

    private handleRecordDelete = (event: Event): void => {
        const detail = (event as CustomEvent<{ entry: HTMLElement }>).detail;
        const entry = detail.entry;
        const index = Number(entry.getAttribute('data-index'));
        if (this.loop && Number.isInteger(index) && this.loop.values[index]) {
            this.loop.values[index].value = '';
            this.loop.refreshAnswerCount();
        }
        entry.remove();
        this.AnswerCount = Math.max(0, this.AnswerCount - 1);
        this.updateEmptyMessage();
    };

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener(
            'paletteRecordCommitted',
            this.handleRecordCommitted,
        );
        this.addEventListener('paletteRecordDelete', this.handleRecordDelete);
        this.loop = document.querySelector('o-palette-loop');

        this.retrieveHistoryTemplate();
        this.setHistoryOutputLocation();
        this.layoutValues();
        this.displayValues();
        this.configureEmptyMessage();
    }

    public disconnectedCallback(): void {
        this.removeEventListener(
            'paletteRecordCommitted',
            this.handleRecordCommitted,
        );
        this.removeEventListener(
            'paletteRecordDelete',
            this.handleRecordDelete,
        );
    }
}
