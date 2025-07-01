import Component from './component';

export default class AButtonTerminator extends Component {
    private behaviour = 'increment';

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

        if (this.behaviour == 'increment') {
            this.incrementValue();
        } else {
            this.decrementValue();
        }
    }

    private incrementValue(): void {
        const incrementValueEvent = new CustomEvent('incrementValue', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(incrementValueEvent);
    }

    private decrementValue(): void {
        const decrementValueEvent = new CustomEvent('decrementValue', {
            bubbles: true,
            detail: this,
        });
        this.dispatchEvent(decrementValueEvent);
    }

    private setLabel(): void {
        if (this.behaviour == 'increment') {
            //this.innerHTML = '&raquo;';
            //this.innerHTML = '<img src="terminator.svg" alt="»"/>';
        } else {
            //this.innerHTML = '&laquo;';
            //this.innerHTML = '<img src="terminator.svg" alt="»"/>';
        }
    }

    private setBehaviour(): void {
        if (this.hasAttribute('data-behaviour')) {
            this.behaviour = this.getAttribute('data-behaviour') ?? 'increment';
        }
    }

    public connectedCallback(): void {
        this.setBehaviour();
        this.setLabel();
        this.addEventListener('click', this);
    }
}
