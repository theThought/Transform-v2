import Component from './component';
import OScale from './o-scale';

export default class AScaleUnit extends Component {
    protected scale: OScale | null = null;

    constructor() {
        super();
    }

    private init(): void {
        this.addLocalEventListeners();
    }

    private addLocalEventListeners(): void {
        this.addEventListener('click', this);
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
        this.broadcastChange();
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

    public update(): void {
        console.log('updating');
    }

    public connectedCallback(): void {
        this.scale = this.closest('o-scale');
        if (!this.scale) return;
        this.scale.addObserver(this);
        this.init();
    }
}
