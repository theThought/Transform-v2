import Component from './component';

export default class OCombobox extends Component {
    private readonly element: HTMLInputElement | null;

    constructor() {
        super();

        this.element = this.querySelector('.a-input-combobox');

        if (!this.element) return;

        this.init();
    }

    private init(): void {}

    // Handle (global) event listeners which are not part of this web component.
    public connectedCallback(): void {
        // e.g. document.addEventListener('broadcastChange', ...);
    }

    public disconnectedCallback(): void {
        // e.g. document.removeEventListener('broadcastChange', ...);
    }
}
