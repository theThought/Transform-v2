import Component from './component';

export default class AButtonTerminatorPre extends Component {
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
        e.stopPropagation();

        const decrementValueEvent = new CustomEvent('decrementValue', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(decrementValueEvent);
    }

    private setLabel(): void {
        this.innerHTML = '&laquo;';
    }

    public connectedCallback(): void {
        this.setLabel();
        this.addEventListener('click', this);
    }
}
