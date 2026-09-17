import Component from './component';

export default class AButtonTerminator extends Component {
    private behaviour = 'increment';

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

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopPropagation();

        if (this.behaviour == 'increment') {
            this.incrementValue();
        } else {
            this.decrementValue();
        }
    }

    private onKeydown(e: KeyboardEvent): void {
        if (e.key !== 'Enter' && e.key !== ' ') return;

        e.preventDefault();
        this.onClick(e);
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
        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');

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
        this.addEventListener('click', this.handleEvent);
        this.addEventListener('keydown', this.handleEvent);
    }
}
