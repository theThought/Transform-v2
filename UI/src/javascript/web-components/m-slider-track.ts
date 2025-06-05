import Component from './component';
import OSlider from './o-slider';
import { Observer } from '../interfaces';

export default class MSliderTrack extends Component implements Observer {
    protected properties = {
        show: {
            value: true,
            marks: false,
            terminators: false,
        },
        ticklabels: 0,
        step: 1,
    };

    private element: HTMLInputElement | null = null;
    private output: HTMLOutputElement | null = null;
    private slider: OSlider | null = null;
    private min = 0;
    private max = 100;

    constructor() {
        super();
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'input':
                this.onInput();
        }
    }

    public update(method: string): void {
        switch (method) {
            case 'exclusiveClear':
                this.exclusiveClear();
                break;
            case 'exclusiveRestore':
                this.restoreData();
                break;
            case 'incrementValue':
                this.incrementValue();
                break;
            case 'decrementValue':
                this.decrementValue();
                break;
        }
    }

    private exclusiveClear(): void {
        this.clearValueClass();
        this.clearFloodFill();
    }

    private restoreData(): void {
        if (!this.element) return;
        const value = Number(this.element.value);

        this.setValueClass();
        this.updateFloodFill(value);
    }

    private onInput(): void {
        if (!this.element) return;

        const value = this.element.value;
        this.setValueClass();
        this.setSliderInputValue();
        this.setThumbDisplay(value);
        this.setThumbValue(value);
        this.setThumbLocation(Number(value));
        this.updateFloodFill(Number(value));
    }

    private setValueClass(): void {
        if (!this.element) return;
        this.classList.add('has-value');
    }

    private clearValueClass(): void {
        if (!this.element) return;
        this.classList.remove('has-value');
    }

    private setThumbDisplay(value: string): void {
        if (!this.output) return;
        this.output.style.display = value === '' ? 'none' : 'block';
    }

    private setThumbValue(value: string): void {
        if (!this.output) return;
        this.output.innerHTML = value;
    }

    private setThumbLocation(value: number): void {
        if (!this.output) return;
        if (!this.element) return;

        const thumbWidth = 32;
        const range = this.max - this.min;

        const position = Number(((value - this.min) / range) * 100);
        const positionOffset =
            Math.round((thumbWidth * position) / 100) - thumbWidth / 2;
        const positionPaddingOffset = Math.round((5 * position) / 100) - 2.5;

        this.output.style.left =
            'calc(' +
            position +
            '% - ' +
            positionOffset +
            'px - ' +
            positionPaddingOffset +
            'px)';
    }

    private configureMarks(): void {
        if (!this.properties.show.marks) return;

        const marksContainer = this.querySelector('.m-divider-marks');
        if (!marksContainer) return;

        const step =
            this.properties.ticklabels > 0
                ? this.properties.ticklabels
                : this.properties.step;

        for (let i = this.min; i <= this.max; i = i + step) {
            const mark = document.createElement('span');
            mark.className = 'a-divider-mark';
            marksContainer.appendChild(mark);
        }
    }

    private updateFloodFill(value: number): void {
        if (!this.element) return;

        const percentage =
            (Math.abs(value - this.min) / Math.abs(this.max - this.min)) * 100;
        const paddingAdjustmentPx = 20;
        const adjustmentCalc =
            paddingAdjustmentPx - 2 * paddingAdjustmentPx * (percentage / 100);
        const percentageFill =
            'calc(' + percentage + '% + ' + adjustmentCalc + 'px)';

        this.element.style.setProperty(
            'background',
            'radial-gradient(farthest-side, var(--color-secondary) 100%, transparent 100%) 4px 4px / 10px 12px, ' +
                'linear-gradient(to bottom, white 0, white 4px, transparent 4px, transparent 16px, white 16px),' +
                'linear-gradient(to right, white 0, white 8px, ' +
                'var(--color-secondary) ' +
                ' 8px, ' +
                'var(--color-secondary) ' +
                ' ' +
                percentageFill +
                ', transparent ' +
                percentageFill +
                ', transparent 100%)',
        );

        this.element.style.setProperty('background-repeat', 'no-repeat');
    }

    private clearFloodFill(): void {
        if (!this.element) return;
        this.element.style.setProperty('background', 'none');
    }

    private setSliderInputValue(): void {
        const notifySlider = new CustomEvent('notifySlider', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(notifySlider);
    }

    private thumbValue(): void {
        if (!this.properties.show.value) return;
        this.classList.add('show-value');
    }

    private incrementValue(): void {
        if (!this.element) return;
        const requestedValue =
            Number(this.element.value) + this.properties.step;
        if (requestedValue <= this.max) {
            this.element.value = String(requestedValue);
        }
        this.onInput();
    }

    private decrementValue(): void {
        if (!this.element) return;
        const requestedValue =
            Number(this.element.value) - this.properties.step;
        if (requestedValue >= this.min) {
            this.element.value = String(requestedValue);
        }
        this.onInput();
    }

    private setProperties(): void {
        if (!this.element) return;
        this.min = this.element.min ? Number(this.element.min) : this.min;
        this.max = this.element.max ? Number(this.element.max) : this.max;
        this.properties.step =
            this.properties.step == 0 ? 1 : this.properties.step;
        this.element.step = String(this.properties.step);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-slider-input');
        this.output = this.querySelector('output');
        this.slider = this.closest('o-slider');

        if (!this.element) return;

        this.addEventListener('focusin', this);
        this.element.addEventListener('input', this);

        this.setProperties();
        this.configureMarks();
        this.thumbValue();

        if (this.response) this.response.addObserver(this);
        if (this.slider) this.slider.addObserver(this);
    }
}
