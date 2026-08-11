import Component from './component';

export default class OPaletteLoop extends Component {
    public values: Array<HTMLInputElement> = [];
    private ExpectedAnswerCount = 0;
    private CurrentAnswerCount = 0;

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
        const inputs = this.querySelectorAll<HTMLInputElement>('input');

        inputs.forEach((input) => {
            this.ExpectedAnswerCount++;
            this.values.push(input);
        });

        this.refreshAnswerCount();
    }

    public refreshAnswerCount(notify = true): void {
        this.CurrentAnswerCount = this.values.filter(
            (input) => input.value.trim().length > 0,
        ).length;

        if (notify) this.notifyCountChange();
    }

    public getNextAvailableInput(): HTMLInputElement | null {
        return (
            this.values.find((input) => input.value.trim().length === 0) ?? null
        );
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

    private setInteractionStatus(): void {
        this.classList.add('inactive');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.retrieveValues();
        this.setInteractionStatus();

        this.addEventListener('input', () => this.refreshAnswerCount());
        this.addEventListener('change', () => this.refreshAnswerCount());
    }
}
