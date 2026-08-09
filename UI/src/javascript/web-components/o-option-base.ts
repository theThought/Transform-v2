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
            case 'exclusiveSelected':
                this.onExclusiveSelected(e as CustomEvent);
                break;
            case 'click':
            case 'questionClick':
                this.onClick(e as MouseEvent);
                break;
            case 'keydown':
                this.onKeydown(e as KeyboardEvent);
                break;
        }
    }

    public update(method: string, data: CustomEvent): void {
        switch (method) {
            case 'clearOtherValues':
                this.clearOtherValues(data);
                break;
            case 'clearExclusiveOptions':
                this.clearExclusiveOptions(data);
                break;
        }
    }

    protected onChange(e: CustomEvent): void {
        if (e.target === this) return;
        if (!this.optionElement) return;
        if (!this.additionalInputElement) return;

        if (e.target === this.additionalInputElement) {
            e.stopImmediatePropagation();
            if (
                !this.optionElement.getChecked() &&
                this.additionalInputElement.getLength()
            ) {
                this.optionElement.changeState(true);
                if (this.optionElement.isExclusive) {
                    const exclusiveSelected = new CustomEvent(
                        'exclusiveSelected',
                        {
                            bubbles: true,
                            detail: this,
                        },
                    );
                    this.dispatchEvent(exclusiveSelected);
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
        if (!this.element || !this.additionalInputElement) return;
        if (this.element.disabled) return;
        if (this.input?.readOnly) return;

        // prevent radio buttons from de-selecting
        if (this.input?.checked && this.element.type === 'radio') return;

        this.additionalInputElement.setFocus();
    }

    protected onExclusiveSelected(e: CustomEvent): void {
        if (e.target === this) return;
        this.qgroup = e.detail.qgroup;
        const exclusiveSelected = new CustomEvent('exclusiveSelected', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(exclusiveSelected);
    }

    protected onKeydown(e: KeyboardEvent): void {
        if (!this.element) return;
        if (this.element.disabled) return;
        if (this.input?.readOnly) return;
        if (this.isReadonly) return;

        // prevent radio buttons from de-selecting
        if (this.input?.checked && this.element.type === 'radio') return;

        const target = e.target as HTMLInputElement;

        if (
            e.key === ' ' &&
            e.key.length === 1 &&
            target.type !== 'text' &&
            this.input?.checked
        ) {
            this.additionalInputElement?.setFocus();
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('broadcastChange', this.handleEvent);
        this.addEventListener('exclusiveSelected', this.handleEvent);
        this.addEventListener('questionClick', this.handleEvent);
        this.optionElement = this.querySelector('m-option-base');
        this.additionalInputElement = this.querySelector('m-singleline');
        if (this.optionElement)
            this.setQuestionGroup(this.optionElement.getQuestionGroup());
    }
}
