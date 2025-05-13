import Component from './component';

export default class OSlider extends Component {
    private element: HTMLInputElement | null = null;
    private range: HTMLInputElement | null = null;
    private min = 0;
    private max = 100;
    private step = 10;

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

    private tickLabels(): void {
        if (
            !this.properties.hasOwnProperty('ticklabels') ||
            typeof this.properties.ticklabels !== 'number'
        ) {
            return;
        }

        const labelsElement = this.querySelector('.m-label-marks');
        if (!labelsElement) return;

        let step = isNaN(this.properties.ticklabels)
            ? 10
            : this.properties.ticklabels;

        if (step === 0) {
            step = Math.floor(((this.max - this.min) / 100) * 10);
        }

        for (let i = this.min; i <= this.max; i = i + step) {
            labelsElement.innerHTML =
                labelsElement.innerHTML + '<span>' + i + '</span>';
        }
    }

    private setProperties(): void {
        if (!this.range) return;

        this.min = this.range.min ? Number(this.range.min) : this.min;
        this.max = this.range.max ? Number(this.range.max) : this.max;
        this.step = this.properties.step
            ? Number(this.properties.step)
            : this.step;
    }

    private init(): void {
        this.addEventListener('broadcastChange', this);
        this.setProperties();
        this.tickLabels();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('input[type="hidden"]');
        this.range = this.querySelector('input[type="range"]');
        this.init();
    }
}
