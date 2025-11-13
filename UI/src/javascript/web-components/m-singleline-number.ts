import MSingleline from './m-singleline';

export default class MSinglelineNumber extends MSingleline {
    protected properties = {
        labels: {
            pre: '',
            post: '',
        },
        allowPaste: false,
        step: 'any',
        showspinner: false,
    };

    constructor() {
        super();
    }

    private setStep(): void {
        if (!this.element || !this.properties.hasOwnProperty('step')) {
            return;
        }

        this.element.step = this.properties.step;
    }

    private setSpinnerVisibility(): void {
        if (!this.element || this.properties.showspinner) return;
        this.element.classList.add('hide-spinner');
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setStep();
        this.setSpinnerVisibility();
    }
}
