import Component from './component';

export default class MSliderTrack extends Component {
    private element: HTMLInputElement | null = null;
    private output: HTMLOutputElement | null = null;

    constructor() {
        super();
    }

    // Handle constructor() event listeners.
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                break;
            case 'input':
                this.onInput();
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
        if (!this.element) return;
        if (!this.output) return;
    }

    private onInput(): void {
        if (!this.element) return;

        const value = this.element.value;
        this.setValueClass();
        this.setDimsValue();
        this.setThumbDisplay(value);
        this.setThumbValue(value);
        this.setThumbLocation(Number(value));
        this.updateFloodFill(Number(value));
    }

    private setValueClass(): void {
        if (!this.element) return;
        if (this.element.value !== '') {
            this.classList.add('has-value');
        }
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

    private updateFloodFill(value: number): void {
        if (!this.element) return;
        if (!this.output) return;

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

    private setDimsValue(): void {
        this.broadcastChange();
    }

    private init(): void {
        this.addLocalEventListeners();
    }

    private addLocalEventListeners(): void {
        if (!this.element) return;
        this.addEventListener('click', this);
        this.element.addEventListener('input', this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.element = this.querySelector('.a-slider-input');
        this.output = this.querySelector('output');
        this.init();
    }
}
