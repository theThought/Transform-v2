import AButtonIcon from './a-button-icon';

export default class AButtonTerminator extends AButtonIcon {
    private behaviour = 'increment';

    protected onClick(e: Event): void {
        super.onClick(e);

        if (this.behaviour === 'increment') {
            this.incrementValue();
        } else {
            this.decrementValue();
        }
    }

    private incrementValue(): void {
        const incrementValueEvent = new CustomEvent('incrementValue', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(incrementValueEvent);
    }

    private decrementValue(): void {
        const decrementValueEvent = new CustomEvent('decrementValue', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(decrementValueEvent);
    }

    private setBehaviour(): void {
        if (this.hasAttribute('data-behaviour')) {
            this.behaviour = this.getAttribute('data-behaviour') ?? 'increment';
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setBehaviour();
    }
}
