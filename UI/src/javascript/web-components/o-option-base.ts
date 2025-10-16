import Option from './option';

export default class OOptionBase extends Option {
    private additionalInputElement: HTMLInputElement | null = null;

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
            case 'questionClick':
                this.onClick(<MouseEvent>e);
                break;
            case 'focusin':
                this.onFocus();
                break;
            case 'keydown':
                this.onKeydown(<KeyboardEvent>e);
                break;
        }
    }

    protected onClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.element.readOnly) return;

        // prevent focus from being stolen by the checkbox where the other-specifier text was clicked
        const target = e.target as HTMLElement;
        if (target === this.additionalInputElement) {
            this.element.focus();
        }

        // prevent radio buttons from de-selecting
        if (this.element.checked && this.element.type === 'radio') return;

        this.changeState(!this.element.checked);
        this.onChange();
        this.additionalInputElement?.focus();
    }

    protected onFocus(): void {
        if (!this.element) return;

        if (this.additionalInputElement?.value.length) {
            this.changeState(true);
            this.onChange();
        }
    }

    protected onKeydown(e: KeyboardEvent): void {
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.element.readOnly) return;

        // prevent radio buttons from de-selecting
        if (this.element.checked && this.element.type === 'radio') return;

        const target = e.target as HTMLInputElement;

        if (e.key === ' ') {
            this.changeState(!this.element.checked);
            this.onChange();
        } else if (
            e.key.length === 1 &&
            target.type == 'text' &&
            !this.element.checked
        ) {
            this.changeState(true);
            this.onChange();
        }

        this.additionalInputElement?.focus();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('questionClick', this.handleEvent);
        this.addEventListener('focusin', this.handleEvent);
        this.additionalInputElement = this.querySelector('input[type="text"]');
    }
}
