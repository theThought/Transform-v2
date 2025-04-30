import { removeHTMLWhitespace } from './util';

export default class OQuestion extends HTMLElement {
    constructor() {
        super();
    }

    private init(): void {
        this.cleanEmptyLayout();
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

    public connectedCallback(): void {
        this.init();
    }
}
