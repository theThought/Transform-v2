import Component from './component';

export default class ODropdown extends Component {
    private element: HTMLInputElement | null = null;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'labelChange':
                this.updateLabel(<CustomEvent>e);
                break;
        }
    }

    private updateLabel(e: CustomEvent): void {
        if (!this.element) return;
        this.element.value = e.detail.dataset.label;
    }

    private configureElement(): void {
        if (!this.element) return;
        this.element.readOnly = true;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-input-dropdown');
        this.addEventListener('labelChange', this.handleEvent);
        this.configureElement();
    }
}
