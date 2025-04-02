import MSingleline from './m-singleline';

export default class MSinglelineNumber extends MSingleline {
    constructor() {
        super();

        this.init();
    }

    protected init(): void {
        super.init();
        this.setStep();
    }

    private setStep(): void {
        if (!this.element || !this.properties.hasOwnProperty('step')) {
            return;
        }

        this.element.step = <string>this.properties.step;
    }
}
