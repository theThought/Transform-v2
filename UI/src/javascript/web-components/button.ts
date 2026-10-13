import Component from './component';

export default class Button extends Component {
    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
            case 'keydown':
                this.onKeydown(e as KeyboardEvent);
                break;
        }
    }

    protected onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();
    }

    protected onKeydown(e: KeyboardEvent): void {
        if (e.key !== 'Enter' && e.key !== ' ') return;

        e.preventDefault();
        this.onClick(e);
    }

    protected setLabel(): void {
        this.setAttribute('role', 'button');
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setLabel();
        this.addEventListener('click', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
    }

    public disconnectedCallback(): void {
        this.removeEventListener('click', this.handleEvent);
        this.removeEventListener('keydown', this.handleEvent);
    }
}
