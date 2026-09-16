import MSingleline from './m-singleline';
import { JsonObject } from './util';

interface CustomProperties extends JsonObject {
    labels: {
        pre: string;
        post: string;
    };
    paste: boolean;
    showspinner: boolean;
}

export default class MSinglelineNumber extends MSingleline {
    protected properties: CustomProperties = {
        labels: {
            pre: '',
            post: '',
        },
        paste: false,
        showspinner: false,
    };

    private lastValidValue: string = '';

    constructor() {
        super();
        this.handleEvent = this.handleEvent.bind(this);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'keydown':
                this.onKeydown(e as KeyboardEvent);
                break;
            case 'beforeinput':
                this.onBeforeInput(e as InputEvent);
                break;
            case 'input':
                this.onInput();
                break;
            case 'blur':
                this.onBlur();
                break;
            case 'paste':
                this.onNumberPaste(e as ClipboardEvent);
                break;
            default:
                super.handleEvent(e);
                break;
        }
    }

    public setValue(val: string): void {
        super.setValue(val);
        this.lastValidValue = this.element?.value ?? '';
    }

    private get isIntegerOnly(): boolean {
        const step = this.element?.step;
        if (
            step === undefined ||
            step === null ||
            step === '' ||
            step === 'any'
        ) {
            return false;
        }
        const stepNum = Number(step);
        return (
            !Number.isNaN(stepNum) && Number.isInteger(stepNum) && stepNum >= 1
        );
    }

    private getMin(): number | null {
        const val = this.element?.min;

        if (val !== undefined && val !== null && val !== '') {
            const parsed = this.parseNumber(String(val));
            return Number.isNaN(parsed) ? null : parsed;
        }
        return null;
    }

    private getMax(): number | null {
        const val = this.element?.max;

        if (val !== undefined && val !== null && val !== '') {
            const parsed = this.parseNumber(String(val));
            return Number.isNaN(parsed) ? null : parsed;
        }
        return null;
    }

    private getStep(): number {
        const val = this.element?.step;

        if (val === undefined || val === null || val === '' || val === 'any') {
            return 1;
        }

        const parsed = this.parseNumber(String(val));
        return Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
    }

    private parseNumber(val: string): number {
        if (!val) return NaN;
        const normalized = val.trim().replace(',', '.');
        if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) {
            return NaN;
        }
        return Number(normalized);
    }

    private formatNumber(num: number, useComma: boolean): string {
        const str = num.toString();
        return useComma ? str.replace('.', ',') : str;
    }

    private hasComma(val: string): boolean {
        return val.includes(',');
    }

    private getPattern(): string {
        const min = this.getMin();
        const allowNegative = min === null || min < 0;
        const sign = allowNegative ? '[+\\-]?' : '\\+?';

        if (this.isIntegerOnly) {
            return `${sign}[0-9]+`;
        }
        return `${sign}([0-9]+([.,][0-9]*)?|[.,][0-9]+)`;
    }

    private isValidIntermediate(val: string): boolean {
        if (val === '') return true;

        const min = this.getMin();
        const allowNegative = min === null || min < 0;
        const signPart = allowNegative ? '[\\-+]?' : '\\+?';

        if (this.isIntegerOnly) {
            const regex = new RegExp(`^${signPart}\\d*$`);
            return regex.test(val);
        }

        const regex = new RegExp(`^${signPart}(?:\\d*(?:[.,]\\d*)?)?$`);
        return regex.test(val);
    }

    private onKeydown(e: KeyboardEvent): void {
        if (this.isReadonly || !this.element || this.element.readOnly) {
            e.stopImmediatePropagation();
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.stepUp(e.shiftKey ? 10 : 1);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            e.stopImmediatePropagation();
            this.stepDown(e.shiftKey ? 10 : 1);
            return;
        }

        if (
            e.key === 'Backspace' ||
            e.key === 'Delete' ||
            e.key === 'Tab' ||
            e.key === 'Escape' ||
            e.key === 'Enter' ||
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'Home' ||
            e.key === 'End' ||
            e.ctrlKey ||
            e.metaKey ||
            e.altKey
        ) {
            e.stopImmediatePropagation();
            return;
        }

        if (e.key.length === 1) {
            const start = this.element.selectionStart ?? 0;
            const end = this.element.selectionEnd ?? 0;
            const currentVal = this.element.value;
            const proposedVal =
                currentVal.slice(0, start) + e.key + currentVal.slice(end);

            if (!this.isValidIntermediate(proposedVal)) {
                e.preventDefault();
            }
        }

        e.stopImmediatePropagation();
    }

    private onBeforeInput(e: InputEvent): void {
        if (this.isReadonly || !this.element || this.element.readOnly) return;
        if (!e.data) return;

        const start = this.element.selectionStart ?? 0;
        const end = this.element.selectionEnd ?? 0;
        const currentVal = this.element.value;
        const proposedVal =
            currentVal.slice(0, start) + e.data + currentVal.slice(end);

        if (!this.isValidIntermediate(proposedVal)) {
            if (e.cancelable) {
                e.preventDefault();
            }
        }
    }

    private onInput(): void {
        if (!this.element) return;

        if (this.isValidIntermediate(this.element.value)) {
            this.lastValidValue = this.element.value;
        } else {
            this.element.value = this.lastValidValue;
        }
        this.broadcastChange();
    }

    private onNumberPaste(e: ClipboardEvent): void {
        const globalPaste = document.body.dataset.paste
            ? document.body.dataset.paste === 'true'
            : false;

        if (
            !this.properties.paste ||
            (!this.properties.paste && !globalPaste)
        ) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (this.isReadonly || !this.element || this.element.readOnly) return;

        const pastedText = e.clipboardData?.getData('text') ?? '';
        const cleanText = pastedText.trim();
        const start = this.element.selectionStart ?? 0;
        const end = this.element.selectionEnd ?? 0;
        const currentVal = this.element.value;
        const proposedVal =
            currentVal.slice(0, start) + cleanText + currentVal.slice(end);

        if (!this.isValidIntermediate(proposedVal)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    private onBlur(): void {
        if (!this.element) return;
        const val = this.element.value.trim();
        if (
            val === '-' ||
            val === '+' ||
            val === '.' ||
            val === ',' ||
            val === '-.' ||
            val === '-,' ||
            val === '+.' ||
            val === '+,'
        ) {
            this.element.value = '';
            this.lastValidValue = '';
            this.broadcastChange();
        }
    }

    public stepUp(multiplier: number = 1): void {
        if (this.isReadonly || !this.element || this.element.readOnly) return;

        const step = this.getStep() * multiplier;
        const min = this.getMin();
        const max = this.getMax();
        const currentVal = this.element.value.trim();
        const useComma = this.hasComma(currentVal);

        let nextVal: number;
        if (currentVal === '' || Number.isNaN(this.parseNumber(currentVal))) {
            if (min !== null) {
                nextVal = min;
            } else {
                nextVal = step > 0 ? step : 0;
            }
        } else {
            const currentNum = this.parseNumber(currentVal);
            nextVal = currentNum + step;
        }

        if (max !== null && nextVal > max) {
            const currentNum = this.parseNumber(currentVal);
            if (!Number.isNaN(currentNum) && currentNum < max) {
                nextVal = max;
            } else if (!Number.isNaN(currentNum) && currentNum >= max) {
                return;
            } else {
                nextVal = max;
            }
        }

        if (min !== null && nextVal < min) {
            nextVal = min;
        }

        this.element.value = this.formatNumber(nextVal, useComma);
        this.lastValidValue = this.element.value;
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
        this.element.dispatchEvent(new Event('change', { bubbles: true }));
        this.broadcastChange();
    }

    public stepDown(multiplier: number = 1): void {
        if (this.isReadonly || !this.element || this.element.readOnly) return;

        const step = this.getStep() * multiplier;
        const min = this.getMin();
        const max = this.getMax();
        const currentVal = this.element.value.trim();
        const useComma = this.hasComma(currentVal);

        let nextVal: number;
        if (currentVal === '' || Number.isNaN(this.parseNumber(currentVal))) {
            if (max !== null && max < 0) {
                nextVal = max;
            } else if (min !== null) {
                nextVal = min;
            } else {
                nextVal = -step;
            }
        } else {
            const currentNum = this.parseNumber(currentVal);
            nextVal = currentNum - step;
        }

        if (min !== null && nextVal < min) {
            const currentNum = this.parseNumber(currentVal);
            if (!Number.isNaN(currentNum) && currentNum > min) {
                nextVal = min;
            } else if (!Number.isNaN(currentNum) && currentNum <= min) {
                return;
            } else {
                nextVal = min;
            }
        }

        if (max !== null && nextVal > max) {
            nextVal = max;
        }

        this.element.value = this.formatNumber(nextVal, useComma);
        this.lastValidValue = this.element.value;
        this.element.dispatchEvent(new Event('input', { bubbles: true }));
        this.element.dispatchEvent(new Event('change', { bubbles: true }));
        this.broadcastChange();
    }

    private setSpinnerVisibility(): void {
        if (!this.element || this.properties.showspinner) return;
        this.element.classList.add('hide-spinner');
    }

    private setupElement(): void {
        if (!this.element) return;

        this.element.type = 'text';
        this.element.setAttribute(
            'inputmode',
            this.isIntegerOnly ? 'numeric' : 'decimal',
        );
        this.element.setAttribute('pattern', this.getPattern());
        this.lastValidValue = this.element.value;

        this.element.addEventListener('beforeinput', this.handleEvent);
        this.element.addEventListener('blur', this.handleEvent);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setupElement();
        this.setSpinnerVisibility();
    }

    public disconnectedCallback(): void {
        if (this.element) {
            this.element.removeEventListener('beforeinput', this.handleEvent);
            this.element.removeEventListener('blur', this.handleEvent);
        }
        super.disconnectedCallback();
    }
}
