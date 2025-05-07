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
        this.output.style.left = `calc(${value}% - (${8 - value * 0.15}px))`;
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
