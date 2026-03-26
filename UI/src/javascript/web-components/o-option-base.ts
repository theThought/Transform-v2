import Option from './option';
import MSingleline from './m-singleline';
import MOptionBase from './m-option-base';

export default class OOptionBase extends Option {
    private additionalInputElement: MSingleline | null = null;
    private optionElement: MOptionBase | null = null;

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'broadcastChange':
                this.onChange(e as CustomEvent);
                break;
            case 'click':
            case 'questionClick':
                this.onClick(<MouseEvent>e);
                break;
            case 'keydown':
                this.onKeydown(<KeyboardEvent>e);
                break;
        }
    }

    protected onChange(e: CustomEvent): void {
        if (!this.optionElement) return;
        if (!this.additionalInputElement) return;

        if (e.target === this.additionalInputElement) {
            if (
                !this.optionElement.getChecked() &&
                this.additionalInputElement.getLength()
            ) {
                this.optionElement.changeState(true);
                if (this.optionElement.isExclusive) {
                    const exclusiveOn = new CustomEvent('exclusiveOn', {
                        bubbles: true,
                        detail: this,
                    });
                    this.dispatchEvent(exclusiveOn);
                }
            }
        } else {
            if (
                !this.optionElement.getChecked() &&
                this.additionalInputElement.getLength()
            ) {
                this.additionalInputElement.setValue('');
            }
        }
    }

    protected onClick(e: MouseEvent): void {
        e.preventDefault();
        e.stopPropagation();
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.element.readOnly) return;

        // prevent radio buttons from de-selecting
        if (this.element.checked && this.element.type === 'radio') return;

        this.additionalInputElement?.element.focus();
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

        this.additionalInputElement?.element.focus();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('broadcastChange', this.handleEvent);
        this.addEventListener('questionClick', this.handleEvent);
        this.optionElement = this.querySelector('m-option-base');
        this.additionalInputElement = this.querySelector('m-singleline');
    }
}
