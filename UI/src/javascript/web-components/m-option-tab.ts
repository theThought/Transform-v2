import MOption from './m-option';

export default class MOptionTab extends MOption {
    static observedAttributes = ['data-checked'];

    protected onClick(e: Event): void {
        if (this.dataset.checked !== 'true') {
            super.onClick(e);

            const submitEvent = new CustomEvent('submitForm', {
                bubbles: true,
                detail: this,
            });

            this.dispatchEvent(submitEvent);
        }
    }

    private handleCheckChange(): void {
        const checkbox: HTMLInputElement | null = this.querySelector('input');
        if (!checkbox) return;

        if (this.dataset.checked === 'true') {
            checkbox.checked = true;
        }
    }

    public attributeChangedCallback(name: string): void {
        if (name === 'data-checked') this.handleCheckChange();
    }
}
