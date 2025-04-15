import AScaleUnit from "./a-scale-unit";
export default class OScaleContainer extends HTMLElement {
    private minValue = 0;
    private maxValue = 10;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    public get minimum(): number {
        return this.minValue;
    }

    public set minimum(value: number) {
        if (!value) {
            value = 1;
        }
        this.minValue = value;
    }

    public get maximum(): number {
        return this.maxValue;
    }

    public set maximum(value: number) {
        if (!value) {
            value = 1;
        }
        this.maxValue = value;
    }

    render() {
        this.innerHTML = ''; // Clear previous content

        for (let counter = this.minimum; counter <= this.maximum; counter++) {
            const scaleUnit = new AScaleUnit();
            scaleUnit.dataValue = counter.toString(); // Set dataValue as string
            this.shadowRoot.appendChild(scaleUnit);
        }
    }
}
