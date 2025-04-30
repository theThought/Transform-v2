export default class MScaleContainer extends HTMLElement {
    private minValue = 0;
    private maxValue = 10;

    constructor() {
        super();
    }

    public set minimum(value: number) {
        if (!value) {
            value = 1;
        }
        this.minValue = value;
    }

    public set maximum(value: number) {
        if (!value) {
            value = 1;
        }
        this.maxValue = value;
    }
}
