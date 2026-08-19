import Component from './component';
import OLoop from './o-palette-loop';

interface PaletteRecordCommittedDetail {
    row: HTMLTableRowElement;
    labels?: Record<string, string>;
}

export default class OHistory extends Component {
    public values: Array<HTMLInputElement> = [];
    private EmptyMessage: HTMLElement | null = null;
    private HistoryDestination: HTMLElement | null = null;
    private AnswerCount = 0;
    private loop: OLoop | null = null;

    private createHistoryEntry(
        rowData: Map<string, string>,
        rowIndex: number,
        rowLabels: Map<string, string> = new Map(),
    ): void {
        if (!this.HistoryDestination) {
            return;
        }

        if (rowData.size === 0) {
            return;
        }

        const historyEntry = document.createElement('o-palette-history-entry');

        // Store each field value as a data attribute with key data-{associateControl}.
        // The history entry renders its visible content from these attributes.
        rowData.forEach((value, associateControl) => {
            historyEntry.setAttribute(`data-${associateControl}`, value);
            const label = rowLabels.get(associateControl);
            if (label) {
                historyEntry.setAttribute(
                    `data-label-${associateControl}`,
                    label,
                );
            }
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
        const rows = this.loop.querySelectorAll<HTMLTableRowElement>('tr');

        rows.forEach((row, rowIndex) => {
            const rowData = new Map<string, string>();
            const rowLabels = new Map<string, string>();
            let hasData = false;

            row.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
                if (input.value.trim()) {
                    const response = input.closest<HTMLElement>('o-response');
                    const associateQuestion =
                        response?.dataset.associateQuestion;
                    if (associateQuestion) {
                        rowData.set(associateQuestion, input.value);
                        const label = this.getInputLabel(input);
                        if (label) rowLabels.set(associateQuestion, label);
                        hasData = true;
                    }
                }
            });

            if (hasData) {
                this.createHistoryEntry(rowData, rowIndex, rowLabels);
            }
        });
    }

    private getInputLabel(input: HTMLInputElement): string | null {
        const response = input.closest<HTMLElement>('o-response');
        const label =
            input.dataset.label ||
            response?.dataset.label ||
            response?.querySelector<HTMLElement>('[data-label]')?.dataset.label;

        return label?.trim() || null;
    }

    public getAnswerCount(): number {
        return this.AnswerCount;
    }

    private configureEmptyMessage(): void {
        this.EmptyMessage = this.querySelector('.history-empty');
        this.EmptyMessage?.classList.add('inactive');

        this.updateEmptyMessage();
    }

    private setHistoryOutputLocation(): void {
        this.HistoryDestination = this.querySelector('.l-row-history');
    }

    private handleRecordCommitted = (event: Event): void => {
        const customEvent = event as CustomEvent<PaletteRecordCommittedDetail>;
        const detail = customEvent.detail;

        if (!detail || !detail.row) {
            return;
        }

        const row = detail.row as HTMLTableRowElement;
        const rowIndex = this.loop
            ? Array.from(this.loop.querySelectorAll('tr')).indexOf(row)
            : -1;

        // Collect all field values from the submitted row
        const rowData = new Map<string, string>();
        const rowLabels = new Map<string, string>();
        row.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
            if (input.value.trim()) {
                const response = input.closest<HTMLElement>('o-response');
                const associateQuestion = response?.dataset.associateQuestion;
                if (associateQuestion) {
                    rowData.set(associateQuestion, input.value);
                    const label = this.getInputLabel(input);
                    if (label) rowLabels.set(associateQuestion, label);
                }
            }
        });

        Object.entries(detail.labels ?? {}).forEach(([control, label]) => {
            if (typeof label === 'string' && label.trim()) {
                rowLabels.set(control, label);
            }
        });

        if (rowData.size > 0) {
            const existingEntry = Array.from(
                this.HistoryDestination?.querySelectorAll<HTMLElement>(
                    'o-palette-history-entry',
                ) ?? [],
            ).find(
                (entry) =>
                    entry.getAttribute('data-index') === String(rowIndex),
            );

            if (existingEntry) {
                Array.from(existingEntry.attributes)
                    .filter(
                        (attribute) =>
                            attribute.name.startsWith('data-') &&
                            attribute.name !== 'data-index',
                    )
                    .forEach((attribute) =>
                        existingEntry.removeAttribute(attribute.name),
                    );
                rowData.forEach((value, associateControl) => {
                    existingEntry.setAttribute(
                        `data-${associateControl}`,
                        value,
                    );
                    const label = rowLabels.get(associateControl);
                    if (label) {
                        existingEntry.setAttribute(
                            `data-label-${associateControl}`,
                            label,
                        );
                    }
                });
                (
                    existingEntry as HTMLElement & { render?: () => void }
                ).render?.();
                existingEntry.classList.remove('active');
            } else {
                this.createHistoryEntry(rowData, rowIndex, rowLabels);
            }
            this.updateEmptyMessage();
        }
    };

    private handleRecordDelete = (event: Event): void => {
        const detail = (event as CustomEvent<{ entry: HTMLElement }>).detail;
        if (!detail?.entry) {
            return;
        }

        const entry = detail.entry;
        const index = Number(entry.getAttribute('data-index'));
        const rows = this.loop?.querySelectorAll<HTMLTableRowElement>('tr');
        const row =
            Number.isInteger(index) && index >= 0 ? rows?.[index] : null;
        if (row && this.loop) {
            row.querySelectorAll<HTMLInputElement>('input').forEach((input) => {
                input.value = '';
            });
            this.loop.refreshAnswerCount();
            this.dispatchEvent(
                new CustomEvent('answerCountChange', {
                    bubbles: true,
                    detail: {
                        currentAnswerCount: this.loop.getCurrentAnswerCount(),
                        expectedAnswerCount: this.loop.getExpectedAnswerCount(),
                        remainingAnswerCount:
                            this.loop.getRemainingAnswerCount(),
                    },
                }),
            );
        }
        entry.remove();
        this.AnswerCount = Math.max(0, this.AnswerCount - 1);
        this.updateEmptyMessage();
    };

    private clearActiveEntry = (): void => {
        this.HistoryDestination?.querySelector(
            'o-palette-history-entry.active',
        )?.classList.remove('active');
    };

    public connectedCallback(): void {
        super.connectedCallback();
        // Listen for events on the window since paletteRecordCommitted is dispatched there
        window.addEventListener(
            'paletteRecordCommitted',
            this.handleRecordCommitted,
        );
        window.addEventListener('paletteRecordDelete', this.handleRecordDelete);
        window.addEventListener(
            'paletteRecordCancelled',
            this.clearActiveEntry,
        );
        this.loop = document.querySelector('o-palette-loop');

        this.setHistoryOutputLocation();
        // The loop collects its values in a microtask, after both components
        // have connected. Read the rows directly so initial history is not
        // dependent on that timing.
        queueMicrotask(() => {
            this.layoutValues();
            this.updateEmptyMessage();
        });
        this.configureEmptyMessage();
    }

    public disconnectedCallback(): void {
        window.removeEventListener(
            'paletteRecordCommitted',
            this.handleRecordCommitted,
        );
        window.removeEventListener(
            'paletteRecordDelete',
            this.handleRecordDelete,
        );
        window.removeEventListener(
            'paletteRecordCancelled',
            this.clearActiveEntry,
        );
    }
}
