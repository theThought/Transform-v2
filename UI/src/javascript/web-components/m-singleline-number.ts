import MSingleline from './m-singleline';

export default class MSinglelineNumber extends MSingleline {
    protected properties = {
        labels: {
            pre: '',
            post: '',
        },
        step: 'any',
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

    public connectedCallback(): void {
        super.connectedCallback();
        this.setStep();
    }
}
