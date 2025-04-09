import MScaleUnit from '../../Molecules/scale/scale-unit';
class OScaleContainer extends HTMLElement {
    private minValue: number;
    private maxValue: number;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    get minimum() {
        return this.minValue;
    }

    set minimum(value:number) {
        if (!value) {
            value = 1;
        }
        this.minValue = value;
    }

    get maximum() {
        return this.maxValue;
    }

    set maximum(value:number) {
        if (!value) {
            value = 1;
        }
        this.maxValue = value
    }

    render() {
        this.shadowRoot.innerHTML = ''; // Clear previous content

        for (let counter = this.minimum; counter <= this.maximum; counter++) {
            const scaleUnit = new MScaleUnit();
            scaleUnit.dataValue = counter.toString(); // Set dataValue as string
            this.shadowRoot.appendChild(scaleUnit);
        }
    }
}

// Export the class
export default OScaleContainer;