import MOptionBase from './m-option-base';

export default class MOptionTab extends MOptionBase {
    static observedAttributes = ['data-checked'];

    protected onClick(e: Event): void {
        if (this.dataset.checked !== 'true') {
            super.onClick(e);
            const form = this.closest('form');
            if (form) form.submit();
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
