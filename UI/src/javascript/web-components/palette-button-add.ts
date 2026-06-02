import Component from './component';
import OPalette from './o-palette';
import { Observer } from '../interfaces';

export default class PaletteButtonAdd extends Component implements Observer {
    private caption = 'Add';
    protected palette: OPalette | null = null;

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();

        if (this.palette?.getRemainingAnswerCount()) {
            this.cloneQuestion();
            this.updateActiveState(0);
        } else {
            console.warn('The loop is fully populated.');
        }
    }

    private cloneQuestion(): void {
        const cloneEvent = new CustomEvent('cloneQuestion', { bubbles: true });
        this.dispatchEvent(cloneEvent);
    }

    public update(method: string, e: CustomEvent): void {
        switch (method) {
            case 'answerCountChange':
                this.updateActiveState(e.detail.remainingAnswerCount);
                break;
        }
    }

    private createButton(): void {
        const button = this.querySelector('button');
        if (!button) return;

        const icon = document.createElement('span');
        const caption = document.createElement('span');
        caption.innerText = this.getAttribute('caption') || this.caption;
        caption.classList.add('caption');
        icon.classList.add('icon');
        icon.innerText = '+';
        button.classList.add('a-button-icon');
        button.classList.add('add');
        button.appendChild(icon);
        button.appendChild(caption);
        this.appendChild(button);
    }

    private updateActiveState(remainingAnswerCount: number): void {
        this.classList.toggle('inactive', !remainingAnswerCount);
    }

    public connectedCallback(): void {
        this.createButton();
        this.addEventListener('click', this.handleEvent);

        this.palette = this.closest('o-palette');

        if (this.palette) this.palette.addObserver(this);
    }
}
