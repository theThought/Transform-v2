import Option from './option';

interface CustomProperties {
    balance?: {
        state: boolean;
        minwidth?: string;
    };
    onesize?: {
        state: boolean;
        maxwidth?: string;
    };
    submit: boolean;
}

export default class MOptionButton extends Option {
    private textElement: HTMLInputElement | null = null;
    protected properties: CustomProperties = {
        balance: {
            state: false,
            minwidth: '',
        },
        onesize: {
            state: false,
            maxwidth: '',
        },
        submit: false,
    };

    protected onClick(): void {
        if (!this.element) return;
        if (this.element.disabled) return;

        const check = this.dataset.checked === 'true';

        this.changeState(!check);
        this.onChange();
        this.setTextElementValue();

        if (this.properties.submit) {
            this.closest('form')?.submit();
        }
    }

    protected clearExclusives(e: CustomEvent): void {
        super.clearExclusives(e);
        this.setTextElementValue();
    }

    protected setElement(): void {
        this.element = this.querySelector('button') ?? null;
        this.textElement = this.querySelector('input[type="hidden"]') ?? null;
    }

    private setInitialCheckState(): void {
        if (!this.element) return;
        if (this.element.dataset.checked === 'true') {
            this.dataset.checked = 'true';
        }
    }

    private storeInitialTextValues(): void {
        if (!this.textElement) return;
        this.textElement.placeholder = this.textElement.value;
    }

    private setTextElementValue(): void {
        if (!this.textElement || !this.element) return;

        if (this.dataset.checked === 'true') {
            this.textElement.value = this.textElement.placeholder;
        } else {
            this.textElement.placeholder = this.textElement.value;
            this.textElement.value = '';
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setInitialCheckState();
        this.storeInitialTextValues();
        this.setTextElementValue();
    }
}
