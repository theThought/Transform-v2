import Component from './component';

export default class OSlider extends Component {
    private element: HTMLInputElement | null = null;

    constructor() {
        super();
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'broadcastChange':
                this.onSliderValueChange(<CustomEvent>e);
                break;
        }
    }

    private onSliderValueChange(e: CustomEvent): void {
        e.stopPropagation();
        if (!this.element) return;

        this.element.value = e.detail.element.value;
    }

    private init(): void {
        this.addEventListener('broadcastChange', this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('input[type="hidden"]');
        this.init();
    }
}
