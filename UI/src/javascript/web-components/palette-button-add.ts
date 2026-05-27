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
        if (this.palette?.getAnswersRemainCount()) {
            console.log('add entry');
        } else {
            alert('No more answers remain to be completed.');
        }
    }

    public update(method: string, detail: CustomEvent): void {}

    private createButton(): void {
        const button = document.createElement('button');
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

    private setActiveState(): void {
        if (!this.palette?.getAnswersRemainCount()) {
            this.closest('div.palette-empty')?.classList.add('inactive');
        } else {
            this.closest('div.palette-empty')?.classList.remove('inactive');
        }
    }

    public connectedCallback(): void {
        this.createButton();
        this.addEventListener('click', this.handleEvent);

        this.palette = this.closest('o-palette');

        if (this.palette) this.palette.addObserver(this);

        this.setActiveState();
    }
}
