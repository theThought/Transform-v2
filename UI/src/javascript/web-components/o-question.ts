import { removeHTMLWhitespace } from './util';

export default class OQuestion extends HTMLElement {
    constructor() {
        super();
    }

    private cleanEmptyLayout(): void {
        const layoutItems = this.querySelectorAll('.l-row');

        if (!layoutItems) {
            return;
        }

        layoutItems.forEach(
            (element) =>
                (element.innerHTML = removeHTMLWhitespace(element.innerHTML)),
        );
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'questionVisibility':
                this.handleVisibility(e as CustomEvent);
                break;
        }
    }

    private handleVisibility(e: CustomEvent): void {
        e.stopPropagation();

        if (e.detail.hidden) {
            this.classList.add('unavailable');
        } else {
            this.classList.remove('unavailable');
        }
    }

    public connectedCallback(): void {
        this.cleanEmptyLayout();
        this.addEventListener('questionVisibility', this);
    }
}
