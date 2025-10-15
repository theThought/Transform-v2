import { removeHTMLWhitespace } from './util';
import Component from './component';

interface CustomProperties {
    separator?: boolean;
}

export default class OQuestion extends Component {
    public properties: CustomProperties = {
        separator: true,
    };

    constructor() {
        super();
    }

    private cleanEmptyLayout(): void {
        const layoutItems = this.querySelectorAll('.l-row');

        if (!layoutItems) {
            return;
        }

        layoutItems.forEach((element) => {
            const innerHTML = element.innerHTML;
            const newHTML = removeHTMLWhitespace(innerHTML);
            if (newHTML !== innerHTML) {
                element.innerHTML = newHTML;
            }
        });
    }

    private setSeparatorStyle(e: CustomEvent): void {
        e.stopPropagation(); // prevent nested questions from broadcasting upward and turning off all separators
        if (e.detail.separator) return;
        this.classList.add('question-no-separator');

        // the following event broadcasts upward to any loop
        if (this.properties.separator) return;
        const separatorEvent = new CustomEvent('setSeparatorStyle', {
            bubbles: true,
            detail: { separator: false, questionGroup: e.detail.questionGroup },
        });
        this.dispatchEvent(separatorEvent);
    }

    public handleEvent(e: Event): void {
        switch (e.type) {
            case 'click':
                this.onClick(e);
                break;
            case 'questionVisibility':
                this.handleVisibility(e as CustomEvent);
                break;
            case 'setSeparatorStyle':
                this.setSeparatorStyle(e as CustomEvent);
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
        super.connectedCallback();
        this.cleanEmptyLayout();
        this.addEventListener('click', this.handleEvent);
        this.addEventListener('questionVisibility', this.handleEvent);
        this.addEventListener('setSeparatorStyle', this.handleEvent);
    }
}
