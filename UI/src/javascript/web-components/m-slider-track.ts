import Component from './component';
import { Observer } from '../interfaces';

export default class MSliderTrack extends Component implements Observer {
    private element: HTMLInputElement | null = null;
    private output: HTMLOutputElement | null = null;
    private min = 0;
    private max = 100;
    private step = 10;

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
        if (method === 'exclusiveClear') {
            this.exclusiveClear();
        }
        if (method === 'exclusiveRestore') {
            this.restoreData();
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

        const min = this.element.min ? Number(this.element.min) : 0;
        const max = this.element.max ? Number(this.element.max) : 100;
        const thumbWidth = 32;
        const range = max - min;

        const position = Number(((value - min) / range) * 100);
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

    private showMarks(): void {
        if (
            typeof this.properties.show !== 'object' ||
            !this.properties.show ||
            !('marks' in this.properties.show) ||
            this.properties.show.marks !== true
        ) {
            return;
        }

        const marksContainer = this.querySelector('.m-divider-marks');

        if (!marksContainer) return;

        for (let i = this.min; i <= this.max; i = i + this.step) {
            const mark = document.createElement('span');
            mark.className = 'a-divider-mark';
            marksContainer.appendChild(mark);
        }
    }

    private updateFloodFill(value: number): void {
        if (!this.element) return;

        const min = this.element.min ? Number(this.element.min) : 0;
        const max = this.element.max ? Number(this.element.max) : 100;

        const percentage = (Math.abs(value - min) / Math.abs(max - min)) * 100;
        const paddingAdjustmentPx = 20;
        const adjustmentCalc =
            paddingAdjustmentPx - 2 * paddingAdjustmentPx * (percentage / 100);
        const percentageFill =
            'calc(' + percentage + '% + ' + adjustmentCalc + 'px)';

        this.element.style.setProperty(
            'background',
            'linear-gradient(to right, ' +
                'var(--color-secondary) ' +
                ' 0%, ' +
                'var(--color-secondary) ' +
                ' ' +
                percentageFill +
                ', transparent ' +
                percentageFill +
                ', transparent 100%)',
        );
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

    private setProperties(): void {
        if (!this.element) return;

        this.min = this.element.min ? Number(this.element.min) : this.min;
        this.max = this.element.max ? Number(this.element.max) : this.max;
        this.element.step = this.properties.step
            ? String(this.properties.step)
            : String(this.step);
        this.step = this.properties.step
            ? Number(this.properties.step)
            : this.step;
    }

    private init(): void {
        this.addLocalEventListeners();
        this.setProperties();
        this.showMarks();
    }

    private addLocalEventListeners(): void {
        if (!this.element) return;
        this.addEventListener('focusin', this);
        this.element.addEventListener('input', this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-slider-input');
        this.output = this.querySelector('output');
        this.init();

        if (!this.response) return;
        this.response.addObserver(this);
    }
}
