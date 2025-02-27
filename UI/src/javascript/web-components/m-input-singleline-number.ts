import MInputSingleline from './m-input-singleline';

export default class MInputSinglelineNumber extends MInputSingleline {
    constructor() {
        super();
    }

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        // e.g. document.addEventListener('broadcastChange', ...);
    }

    public disconnectedCallback(): void {
        // e.g. document.removeEventListener('broadcastChange', ...);
    }
}
