import MSingleline from './m-singleline';

export default class MSinglelineNumber extends MSingleline {
    constructor() {
        super();
    }

    private setStep(): void {
        if (!this.element || !this.properties.hasOwnProperty('step')) {
            return;
        }

        this.element.step = <string>this.properties.step;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        super.init();
        this.setStep();
    }
}
