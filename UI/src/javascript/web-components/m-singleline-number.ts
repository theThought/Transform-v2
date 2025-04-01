import MSingleline from './m-singleline';

export default class MSinglelineNumber extends MSingleline {
    constructor() {
        super();

        this.init();
    }

    protected init(): void {
        super.init();
        this.setMin();
        this.setMax();
        this.setStep();
    }

    private setMin(): void {
        if (!this.element || !this.properties.hasOwnProperty('min')) {
            return;
        }

        this.element.min = <string>this.properties.min;
    }

    private setMax(): void {
        if (!this.element || !this.properties.hasOwnProperty('max')) {
            return;
        }

        this.element.max = <string>this.properties.max;
    }

    private setStep(): void {
        if (!this.element || !this.properties.hasOwnProperty('step')) {
            return;
        }

        this.element.step = <string>this.properties.step;
    }
}
