import Component from './component';

export default class OPaletteLoop extends Component {
    public values: Array<HTMLInputElement> = [];
    private rows: Array<HTMLTableRowElement> = [];
    private ExpectedAnswerCount = 0;
    private CurrentAnswerCount = 0;
    private isInitialized = false;

    private notifyCountChange(): void {
        this.dispatchEvent(
            new CustomEvent('answerCountChange', {
                bubbles: true,
                detail: {
                    currentAnswerCount: this.getCurrentAnswerCount(),
                    expectedAnswerCount: this.getExpectedAnswerCount(),
                    remainingAnswerCount: this.getRemainingAnswerCount(),
                },
            }),
        );
    }

    private retrieveValues(): void {
        this.values = [];
        this.rows = Array.from(
            this.querySelectorAll<HTMLTableRowElement>('tbody tr'),
        );

        const inputs = this.querySelectorAll<HTMLInputElement>('input');

        // Keep a fallback for loop markup that does not use a table body.
        if (!this.rows.length) {
            this.rows = Array.from(
                new Set(
                    Array.from(inputs)
                        .map((input) => input.closest('tr'))
                        .filter(
                            (row): row is HTMLTableRowElement => row !== null,
                        ),
                ),
            );
        }

        inputs.forEach((input) => {
            this.values.push(input);
        });

        this.ExpectedAnswerCount = this.rows.length;

        this.refreshAnswerCount();
        this.isInitialized = true;
    }

    public refreshAnswerCount(notify = true): void {
        this.CurrentAnswerCount = this.rows.filter((row) =>
            Array.from(row.querySelectorAll<HTMLInputElement>('input')).some(
                (input) => input.value.trim().length > 0,
            ),
        ).length;

        if (notify) this.notifyCountChange();
    }

    public getNextAvailableInput(): HTMLInputElement | null {
        const availableRow = this.rows.find(
            (row) =>
                !Array.from(
                    row.querySelectorAll<HTMLInputElement>('input'),
                ).some((input) => input.value.trim().length > 0),
        );

        return availableRow?.querySelector<HTMLInputElement>('input') ?? null;
    }

    public getNextAvailableRow(): HTMLTableRowElement | null {
        return this.rows.find(
            (row) =>
                !Array.from(
                    row.querySelectorAll<HTMLInputElement>('input'),
                ).some((input) => input.value.trim().length > 0),
        ) ?? null;
    }

    public getExpectedAnswerCount(): number {
        return this.ExpectedAnswerCount;
    }

    public getCurrentAnswerCount(): number {
        return this.CurrentAnswerCount;
    }

    public getRemainingAnswerCount(): number {
        return this.ExpectedAnswerCount - this.CurrentAnswerCount;
    }

    public isLoopInitialized(): boolean {
        return this.isInitialized;
    }

    private setInteractionStatus(): void {
        this.classList.add('inactive');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setInteractionStatus();

        this.addEventListener('input', () => this.refreshAnswerCount());
        this.addEventListener('change', () => this.refreshAnswerCount());

        // The loop may be connected while its table is still being parsed.
        // Collect rows after the current DOM construction cycle completes.
        queueMicrotask(() => this.retrieveValues());
    }
}
