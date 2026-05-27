import Component from './component';

export default class OPaletteLoop extends Component {
    public values: Array<HTMLInputElement> = [];
    private ExpectedAnswerCount = 0;
    private CurrentAnswerCount = 0;

    private retrieveValues(): void {
        const inputs = this.querySelectorAll('input');

        inputs.forEach((input) => {
            this.ExpectedAnswerCount++;
            this.values.push(input);
            if (input.value.length) this.CurrentAnswerCount++;
        });
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
    }
}
