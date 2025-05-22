import Component from './component';
import OScale from './o-scale';
import { Observer } from '../interfaces';

export default class AScaleUnit extends Component implements Observer {
    protected scale: OScale | null = null;

    constructor() {
        super();
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();

        const scaleUnitClick = new CustomEvent('scaleUnitClick', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(scaleUnitClick);
    }

    get dataValue(): null | string {
        return this.getAttribute('data-value');
    }

    set dataValue(value: string) {
        if (!value) {
            value = '1';
        }
        this.setAttribute('data-value', value);
        this.textContent = this.dataValue ?? '0';
    }

    public update(method: string, value: string): void {
        if (method === 'newValue') {
            this.updateSelectedClasses(value);
        }
    }

    private updateSelectedClasses(value: string): void {
        if (value === this.dataValue) {
            this.classList.add('selected');
        } else {
            this.classList.remove('selected');
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener('click', this);

        this.scale = this.closest('o-scale');

        if (this.scale) this.scale.addObserver(this);
    }

    public disconnectedCallback(): void {
        if (this.scale) this.scale.removeObserver(this);
    }
}
