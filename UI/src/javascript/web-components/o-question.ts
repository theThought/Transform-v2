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
            case 'click':
                this.onClick(e);
                break;
            case 'questionVisibility':
                this.handleVisibility(e as CustomEvent);
                break;
        }
    }

    private onClick(e: Event): void {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.parentElement?.tagName === 'TD' && e.target === this) {
            const clickableElement = this.querySelector(
                'm-option-base, m-option-boolean, input[type="text"]',
            ) as HTMLElement;
            if (clickableElement) {
                clickableElement.focus();
                clickableElement.click();
            }
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
        this.addEventListener('click', this.handleEvent);
        this.addEventListener('questionVisibility', this.handleEvent);
    }
}
