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

    protected onClick(e: Event): void {
        super.onClick(e);

        if (this.properties.submit) {
            this.closest('form')?.submit();
        }
    }

    protected setElement(): void {
        this.element = this.querySelector('button') ?? null;
    }
}
