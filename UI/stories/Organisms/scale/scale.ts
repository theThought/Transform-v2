import OScaleContainer from './scale-container';
import {MLabelPrePost} from '../../Molecules/Labels/prepost';
class OScale extends HTMLElement {
    private minValue: number;
    private maxValue: number;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.setAttribute('data-question-id', '_Q0');
        this.setAttribute('data-question-group', '_QText');
        this.setAttribute('data-properties','{"labels":{"pre":"preLabel","post":"PostLabel"}}')
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.textContent = ''; // Clear previous content

        const prepostLabels = MLabelPrePost();
        this.shadowRoot.appendChild(prepostLabels);

        const scaleContainer = new OScaleContainer();
        this.shadowRoot.appendChild(scaleContainer);
    }
}

// Export the class
export default OScale;