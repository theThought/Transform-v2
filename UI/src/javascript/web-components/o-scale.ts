import OScaleContainer from './m-scale-container';
// import { MLabelPrePost } from '../../../stories/Molecules/Label/prepost';
class OScale extends HTMLElement {
    private minValue: number;
    private maxValue: number;

    constructor() {
        super();
    }

    render() {
        this.textContent = ''; // Clear previous content
        /**
         * MLabelPrePost should not refer to a story
        const prepostLabels = MLabelPrePost();  
        this.appendChild(prepostLabels);
         */
        const scaleContainer = new OScaleContainer();
        this.appendChild(scaleContainer);
    }
}

// Export the class
export default OScale;
