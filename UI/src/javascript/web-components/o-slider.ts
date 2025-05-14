import Component from './component';
import { Observer } from '../interfaces';

export default class OSlider extends Component implements Observer {
    private element: HTMLInputElement | null = null;
    private range: HTMLInputElement | null = null;
    private min = 0;
    private max = 100;
    private step = 10;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'notifySlider':
                this.onSliderValueChange(<CustomEvent>e);
                break;
        }
    }

    public update(method: string, data: CustomEvent): void {
        if (method === 'exclusiveClear') {
            this.exclusiveClear(data);
        }

        if (method === 'exclusiveRestore') {
            this.restoreData();
        }
    }

    private exclusiveClear(e: CustomEvent): void {
        if (!this.element) return;

        if (e.target === this) {
            return;
        }

        if (this.element.value) {
            this.element.placeholder = this.element.value;
            this.element.value = '';
        }
    }

    private restoreData(): void {
        if (!this.element) return;

        if (this.element.placeholder.length) {
            this.element.value = this.element.placeholder;
            this.element.placeholder = '';
            this.broadcastChange();
        }
    }

    private onSliderValueChange(e: CustomEvent): void {
        e.stopPropagation();
        if (!this.element) return;

        this.element.value = e.detail.element.value;
        this.element.placeholder = '';
        this.broadcastChange();
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
            const labelElement = document.createElement('span');
            labelElement.className = 'a-label-mark';
            labelElement.innerHTML = String(i);
            labelsElement.appendChild(labelElement);
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
        this.addEventListener('notifySlider', this);
        this.setProperties();
        this.tickLabels();
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('input[type="hidden"]');
        this.range = this.querySelector('input[type="range"]');
        this.init();

        if (!this.response) return;
        this.response.addObserver(this);
    }
}
