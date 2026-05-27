import Component from './component';
import OLoop from './o-palette-loop';

export default class OHistory extends Component {
    public values: Array<HTMLInputElement> = [];
    private EmptyMessage: HTMLElement | null = null;
    private HistoryDestination: HTMLElement | null = null;
    private AnswerCount = 0;
    private loop: OLoop | null = null;

    private layoutValues(): void {
        if (!this.loop) return;

        this.loop.values.forEach((input) => {
            const InputElement = input as HTMLInputElement;
            if (!InputElement.value.length) return;

            this.AnswerCount++;
            const historyEntry = document.createElement(
                'o-palette-history-entry',
            );
            historyEntry.setAttribute('data-value', InputElement.value);
            historyEntry.innerHTML = InputElement.value;
            this.HistoryDestination?.appendChild(historyEntry);
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

        if (this.loop?.getCurrentAnswerCount() == 0) {
            this.EmptyMessage?.classList.remove('inactive');
        } else {
            this.EmptyMessage?.classList.add('inactive');
        }
    }

    private retrieveHistoryTemplate(): void {}

    private setHistoryOutputLocation(): void {
        this.HistoryDestination = this.querySelector('.l-row-history');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.loop = document.querySelector('o-palette-loop');

        this.retrieveHistoryTemplate();
        this.setHistoryOutputLocation();
        this.layoutValues();
        this.displayValues();
        this.configureEmptyMessage();
    }
}
