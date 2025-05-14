import Component from './component';

export default class AButtonTerminatorPost extends Component {
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

        const incrementValueEvent = new CustomEvent('incrementValue', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(incrementValueEvent);
    }

    private setLabel(): void {
        this.innerHTML = '&raquo;';
    }

    public connectedCallback(): void {
        this.setLabel();
        this.addEventListener('click', this);
    }
}
