import Component from './component';
import OLoop from './o-palette-loop';

export default class OHistory extends Component {
    public values: Array<HTMLInputElement> = [];
    private EmptyMessage: HTMLElement | null = null;
    private HistoryDestination: HTMLElement | null = null;
    private AnswerCount = 0;
    private loop: OLoop | null = null;

    private createHistoryEntry(value: string, index?: number): void {
        if (!this.HistoryDestination || !value.length) return;

        const historyEntry = document.createElement('o-palette-history-entry');
        historyEntry.setAttribute('data-value', value);
        if (index !== undefined) {
            historyEntry.setAttribute('data-index', index.toString());
        }
        this.HistoryDestination.appendChild(historyEntry);
        this.AnswerCount++;
    }

    private updateEmptyMessage(): void {
        this.EmptyMessage?.classList.toggle('inactive', this.AnswerCount > 0);
    }

    private layoutValues(): void {
        if (!this.loop) return;

        this.loop.values.forEach((input) => {
            const InputElement = input as HTMLInputElement;
            if (!InputElement.value.length) return;

            this.createHistoryEntry(
                InputElement.value,
                this.loop?.values.indexOf(InputElement),
            );
        });
    }

    public getAnswerCount(): number {
        return this.AnswerCount;
    }

    private displayValues(): void {
        this.values.forEach((input) => {
            if (!input.value.length) return;
            console.log(input.value);
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
        const detail = (event as CustomEvent<{ value: string; index: number }>)
            .detail;
        this.createHistoryEntry(detail.value, detail.index);
        this.updateEmptyMessage();
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
