import OScaleContainer from './o-scale-container';
import { MLabelPrePost } from '../../../stories/Molecules/Labels/prepost';
class OScale extends HTMLElement {
    private minValue: number;
    private maxValue: number;

    constructor() {
        super();
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
